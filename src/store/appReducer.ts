import { AppState } from '.';
import { appRequest } from '../api';
import { Urls } from '../api/Urls';
import { OPTIONS } from '../hooks/useOption';
import {
  createDueDate,
  getCustomerFullname,
  getCustomerPLZ,
  getCustomerStreet,
  getPrintableDate,
} from '../utils/utils';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash';
import { AppService, Furniture, Gutschrift, MLeistung, Order, Prices, Rechnung } from 'um-types';

function _initOrder(): Order {
  return {
    customer: {
      telNumber: '',
    },
    from: {
      demontage: false,
    },
    to: {
      montage: false,
    },
    date: new Date().toLocaleDateString('ru'),
    items: new Array<Furniture>(),
    timeBased: {},
    leistungen: new Array<MLeistung>(),
    time: '07:00',
    images: new Array<string>(),
    src: 'individuelle',
  } as Order;
}

interface RootState {
  state: AppState;
}

interface CreateUpdateOptionPaylod {
  name: string;
  value: any;
}

export interface AppOptions {
  [name: string]: any;
}

export const loadAllOptions = createAsyncThunk('options/loadAllOptions', () => {
  return appRequest('get')(Urls.options());
});

export const updateOption = createAsyncThunk('options/updateOption', (payload: CreateUpdateOptionPaylod) => {
  return appRequest('put')(Urls.options(payload.name), {
    value: payload.value,
  }).then(() => {
    return payload;
  });
});

export interface AppSlice {
  current: Order | null;
  options: AppOptions;
  unsavedChanges: boolean;
}

const initialState: AppSlice = {
  current: null,
  options: {},
  unsavedChanges: false,
};

export const loadOrder = createAsyncThunk('loadOrder', (id: string) => {
  return appRequest('get')(Urls.orderById(id));
});

export const deleteOrder = createAsyncThunk<void, void, RootState>('deleteOrder', (_, thunkApi) => {
  const state = thunkApi.getState();
  const currentOrder = state.app.current;
  if (currentOrder !== null && currentOrder.id) {
    return appRequest('delete')(Urls.orderById(currentOrder.id));
  }
});

const calculate = (order: Order, options: AppOptions): Order => {
  const calculated = { ...order };

  const discountValue = (Number(order.timeBased?.basis || 0) / 100) * Number(order.discount || 0);

  calculated.discountValue = discountValue;

  const prices: Prices = {};

  prices.halteverbotszonen =
    Number(options[OPTIONS.HVZ_PRICE]) * (Number(order?.from?.parkingSlot || 0) + Number(order?.to?.parkingSlot || 0));

  const services = order.services?.filter((s) => s.tag === 'Bohrarbeiten');
  const verpackung = order.services?.filter((s) => s.tag === 'Packmaterial');

  let servicesPrice = 0;
  let verpackungPrice = 0;
  let otherPrices = 0;

  if (services?.length > 0) {
    services.forEach((s) => {
      if (s.price && s.colli) {
        servicesPrice += Number(s.price) * Number(s.colli);
      }
    });
  }
  if (verpackung?.length > 0) {
    verpackung.forEach((v) => {
      if (v.price && v.colli) {
        verpackungPrice += Number(v.price) * Number(v.colli);
      }
    });
  }

  if (order?.leistungen?.length > 0) {
    order.leistungen.forEach((l) => {
      if (l.sum && l.calculate === true) {
        otherPrices += Number(l.sum);
      }
    });
  }

  prices.services = servicesPrice;
  prices.verpackung = verpackungPrice;
  prices.other = otherPrices;
  calculated.prices = prices;

  const sum =
    Number(calculated.timeBased?.basis || 0) -
    Number(calculated.discountValue || 0) +
    Number(calculated.prices?.halteverbotszonen || 0) +
    Number(calculated.prices?.services || 0) +
    Number(calculated.prices?.verpackung || 0) +
    Number(calculated.prices?.other || 0);

  calculated.sum = sum;

  return calculated;
};

const appSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder(state, action: PayloadAction<Order>) {
      state.current = action.payload;
    },

    initOrder(state) {
      state.current = _initOrder();
      state.unsavedChanges = true;
    },

    updateOrderProps(state, action: PayloadAction<{ path: string[]; value: any }>) {
      const { path, value } = action.payload;

      const curOrder = state.current;
      if (curOrder) {
        curOrder.lupd = Date.now();
        set(curOrder, path, value);

        state.current = calculate(curOrder, state.options);
      }
      state.unsavedChanges = true;
    },

    pushItem(state, action: PayloadAction<{ item: Furniture }>) {
      if (state.current) {
        state.current.lupd = Date.now();
        state.current.items = [action.payload.item, ...state.current.items];
        state.unsavedChanges = true;
      }
    },

    updateOrderItemColli(state, action: PayloadAction<{ item: Furniture; colli: string | number }>) {
      const { item, colli } = action.payload;
      const curOrder = state.current;
      if (curOrder) {
        curOrder.lupd = Date.now();
        const index = curOrder.items.findIndex(
          (i) => i.name === item.name && i.selectedCategory === item.selectedCategory,
        );
        if (index !== -1) {
          set(curOrder, ['items', index, 'colli'], colli);
        }
        state.unsavedChanges = true;
      }
    },

    setUnsavedChanges(state, action: PayloadAction<{ unsavedChanges: boolean }>) {
      state.unsavedChanges = action.payload.unsavedChanges;
    },

    deleteItem(state, action: PayloadAction<{ item: Furniture }>) {
      const { item } = action.payload;
      const curOrder = state.current;
      if (curOrder) {
        curOrder.lupd = Date.now();
        const next = [...curOrder.items];

        const index = next.findIndex((i) => i.name === item.name && i.selectedCategory === item.selectedCategory);
        if (index !== -1) {
          next.splice(index, 1);
          set(curOrder, ['items'], next);
        }
        state.unsavedChanges = true;
      }
    },

    updateOrderService(state, action: PayloadAction<{ service: AppService }>) {
      const { service } = action.payload;

      if (!state.current?.services) {
        state.current!.services = [];
      }

      const curOrder = state.current;

      if (curOrder) {
        curOrder.lupd = Date.now();
        const curServices = curOrder.services;
        const available = curServices.find((s) => s.id === service.id);
        if (available) {
          available.colli = service.colli;
        } else {
          curServices.push(service);
        }
        state.current = calculate(curOrder, state.options);
        state.unsavedChanges = true;
      }
    },

    pushLeistung(state, action: PayloadAction<MLeistung>) {
      const curOrder = state.current;

      if (curOrder) {
        curOrder.lupd = Date.now();
        if (!curOrder.leistungen) {
          curOrder.leistungen = [];
        }
        curOrder.leistungen.push(action.payload);
        state.current = calculate(curOrder, state.options);
      }
      state.unsavedChanges = true;
    },

    initCredit(state) {
      const curOrder = state.current;
      if (curOrder) {
        curOrder.lupd = Date.now();
        const entries: MLeistung[] = [];
        const newCredit: Gutschrift = {
          date: new Date().toLocaleDateString('ru'),
          text: '',
          gNumber: state.options['gNumber'],
          entries,
        };
        set(curOrder, ['gutschrift'], newCredit);
        state.unsavedChanges = true;
      }
    },

    initInvoice(state) {
      const curOrder = state.current;
      if (curOrder) {
        curOrder.lupd = Date.now();
        const entries: MLeistung[] = [];
        if (curOrder?.leistungen) {
          const entry = { ...(curOrder?.leistungen?.[0] || {}) };
          if (entry.desc?.includes('Träger')) {
            entry.desc = `Umzug am ${getPrintableDate(curOrder?.date)}`;
          }
          entries.push(entry);
          if (curOrder?.leistungen?.length > 1) {
            entries.push(...curOrder?.leistungen?.from(1));
          }
        }

        const newInvoice: Rechnung = {
          date: new Date().toLocaleDateString('ru'),
          text: '',
          firma: state.current?.customer.company,
          rNumber: state.options['rNumber'],
          customerName: getCustomerFullname(curOrder),
          customerPlz: getCustomerPLZ(curOrder),
          customerStreet: getCustomerStreet(curOrder),
          entries,
          dueDates: [createDueDate(0)],
        } as Rechnung;

        set(curOrder, ['rechnung'], newInvoice);
        state.unsavedChanges = true;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadOrder.fulfilled, (state, { payload }) => {
        state.current = payload;
        state.unsavedChanges = false;
      })
      .addCase(loadOrder.rejected, (state) => {
        state.current = null;
        state.unsavedChanges = false;
      })
      .addCase(deleteOrder.fulfilled, (state) => {
        state.current = null;
        state.unsavedChanges = false;
      })
      .addCase(loadAllOptions.fulfilled, (state, action) => {
        state.options = action.payload;
      })
      .addCase(updateOption.fulfilled, (state, action: PayloadAction<CreateUpdateOptionPaylod>) => {
        const { name, value } = action.payload;
        state.options[name] = value;
      });
  },
});

const appReducer = appSlice.reducer;

export const {
  initOrder,
  deleteItem,
  updateOrderProps,
  updateOrderService,
  setOrder,
  updateOrderItemColli,
  pushItem,
  pushLeistung,
  initInvoice,
  initCredit,
  setUnsavedChanges,
} = appSlice.actions;

export { appReducer };
