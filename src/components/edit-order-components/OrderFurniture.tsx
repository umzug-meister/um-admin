import { Grid, Tabs } from '@mui/material';
import Tab from '@mui/material/Tab';

import { useState } from 'react';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';
import { TabPanel } from '../shared/TabPanel';
import OrderImages from './OrderImages';
import { OrderFurnitureList } from './order-furniture-list/OrderFurnitureList';

export function OrderFurniture() {
  const order = useCurrentOrder();
  const [value, setValue] = useState(order?.ownItems ? 1 : 0);
  return (
    <>
      <Grid item xs={6}>
        <AppCard title="Möbelliste">
          <Tabs
            textColor="secondary"
            indicatorColor="secondary"
            value={value}
            onChange={(_, next) => {
              setValue(next);
            }}
          >
            <Tab label="Übertragene Liste"></Tab>
            <Tab label="Manuelle Liste"></Tab>
          </Tabs>
          <TabPanel index={0} value={value}>
            <OrderFurnitureList />
          </TabPanel>
          <TabPanel index={1} value={value}>
            <OrderField path="ownItems" multiline />
          </TabPanel>
        </AppCard>
      </Grid>

      <Grid item xs={6}>
        <AppCard title="Kartons & Volumen">
          <OrderField path="boxNumber" label="Kartons" type="number" />
          <OrderField path="kleiderboxNumber" label="Kleiderboxen" type="number" />
          <OrderField path="volume" label="Volumen" type="number" />
          <OrderField path="expensiveText" multiline label="Besonders wertvolle Gegenstände" />
          <OrderImages />
        </AppCard>
      </Grid>
    </>
  );
}
