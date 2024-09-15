import { AppState } from '.';
import { Urls } from '../api/Urls';
import { appRequest } from '../api/fetch-client';
import { AppServices } from '../app-types';

import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppCounter, OrderSrcType, Service } from 'um-types';

export const loadAllServices = createAsyncThunk('loadAllServices', () => {
  return appRequest('get')(Urls.services());
});

export const updateService = createAsyncThunk('updateService', (service: Service) => {
  return appRequest('put')(Urls.services(service.id), service);
});

export const deleteService = createAsyncThunk('deleteService', (id: number) => {
  return appRequest('delete')(Urls.services(id)).then(() => ({ id }));
});

export const createAppService = createAsyncThunk('createAppService', (service: Partial<Service>) => {
  return appRequest('post')(Urls.services(''), service);
});

const servicesSlice = createSlice<AppServices, any, 'services', any>({
  name: 'services',
  initialState: {
    all: [],
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadAllServices.fulfilled, (state, action) => {
        state.all = action.payload;
      })
      .addCase(createAppService.fulfilled, (state, action) => {
        state.all.push(action.payload);
      })
      .addCase(updateService.fulfilled, (state, action: PayloadAction<Service>) => {
        const idx = state.all.findIndex((srv) => srv.id === action.payload.id);
        if (idx !== -1) {
          state.all.splice(idx, 1, action.payload);
        }
      })
      .addCase(deleteService.fulfilled, (state, { payload }) => {
        state.all = state.all.filter((s) => s.id !== payload.id);
      });
  },
});

const servicesReducer = servicesSlice.reducer;
export { servicesReducer };
