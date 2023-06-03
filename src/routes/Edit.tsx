import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Accounting } from '../components/Accounting';
import AddressWidget from '../components/edit-order-components/AddressWidget';
import { CustomerWidget } from '../components/edit-order-components/CustomerWidget';
import DateTime from '../components/edit-order-components/DateTime';
import Distance from '../components/edit-order-components/Distance';
import { OrderConditionsChips } from '../components/edit-order-components/OrderConditionsChips';
import { OrderConditionsGrid } from '../components/edit-order-components/OrderConditionsGrid';
import { OrderFurniture } from '../components/edit-order-components/OrderFurniture';
import OrderOfferSelector from '../components/edit-order-components/OrderOfferSelector';
import OrderPacking from '../components/edit-order-components/OrderPacking';
import OrderPrice from '../components/edit-order-components/OrderPrice';
import OrderServices from '../components/edit-order-components/OrderServices';
import { OrderText } from '../components/edit-order-components/OrderText';
import Resources from '../components/edit-order-components/Resources';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import { RootBox } from '../components/shared/RootBox';
import { TabPanel } from '../components/shared/TabPanel';
import { AppDispatch, AppState } from '../store';
import { initOrder, loadOrder } from '../store/appReducer';

import { Order } from 'um-types';

export default function Edit() {
  const order = useLoadOrder();

  const [value, setValue] = useState(0);

  if (order == null) {
    return null;
  }

  return (
    <RootBox>
      <Tabs
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
      >
        <Tab label="Kunde" />
        <Tab label="Adressen" />
        <Tab label="Basis" />
        <Tab label="Extras" />
        <Tab label="Umzugsgut" />
        <Tab label="Konditionen" />
        <Tab label="Buchhaltung" />
      </Tabs>
      <TabPanel index={0} value={value}>
        <AppGridContainer>
          <CustomerWidget />
          <OrderText />
        </AppGridContainer>
      </TabPanel>
      <TabPanel index={1} value={value}>
        <AppGridContainer>
          <AddressWidget path="from" />
          <AddressWidget path="to" />
          <Distance />
        </AppGridContainer>
      </TabPanel>
      <TabPanel index={2} value={value}>
        <AppGridContainer>
          <DateTime />
          <Resources />
          <OrderPrice />
          <OrderOfferSelector />
        </AppGridContainer>
      </TabPanel>
      <TabPanel index={3} value={value}>
        <AppGridContainer>
          <OrderPacking />
          <OrderServices />
        </AppGridContainer>
      </TabPanel>
      <TabPanel index={4} value={value}>
        <AppGridContainer>
          <OrderFurniture />
        </AppGridContainer>
      </TabPanel>
      <TabPanel index={5} value={value}>
        <AppGridContainer>
          <OrderConditionsChips />
          <OrderConditionsGrid />
        </AppGridContainer>
      </TabPanel>
      <TabPanel index={6} value={value}>
        <AppGridContainer>
          <Accounting />
        </AppGridContainer>
      </TabPanel>
    </RootBox>
  );
}

export function useLoadOrder() {
  const order = useSelector<AppState, Order | null>((s) => s.app.current);
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (params.id && Number(params.id) !== -1) {
      dispatch(loadOrder(params.id));
    }

    if (Number(params.id) === -1) {
      dispatch(initOrder());
    }
  }, [params, dispatch]);

  return order;
}
