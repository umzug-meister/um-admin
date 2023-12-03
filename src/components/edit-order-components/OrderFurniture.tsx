import { Alert, Grid, Tabs, Typography } from '@mui/material';
import Tab from '@mui/material/Tab';

import { useState } from 'react';

import { Address } from 'um-types';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';
import { GridItem } from '../shared/GridItem';
import { TabPanel } from '../shared/TabPanel';
import { OrderFurnitureList } from './order-furniture-list/OrderFurnitureList';
import OrderImages from './OrderImages';

export function OrderFurniture() {
  const order = useCurrentOrder();
  const [value, setValue] = useState(order?.ownItems ? 1 : 0);
  return (
    <>
      <GridItem md={4} xs={12}>
        <AppCard title="Auszug">
          <OrderField<Address> path="from" nestedPath="packservice" label="Einpacken erwünscht?" as="checkbox" />
          <OrderField<Address> path="from" nestedPath="demontage" label="Demontage erwünscht?" as="checkbox" />
          <OrderField<Address> path="from" nestedPath="bedNumber" label="Betten" type="number" />
          <OrderField<Address> path="from" nestedPath="wardrobeWidth" label="Schränke-Gesamtbreite, m" type="number" />
          <OrderField<Address> path="from" nestedPath="kitchenWidth" label="Küche-Gesamtbreite, m" type="number" />
        </AppCard>
      </GridItem>
      <GridItem md={4} xs={12}>
        <AppCard title="Einzug">
          <OrderField<Address> path="to" nestedPath="packservice" label="Auspacken erwünscht?" as="checkbox" />
          <OrderField<Address> path="to" nestedPath="montage" label="Montage erwünscht?" as="checkbox" />
          <OrderField<Address> path="to" nestedPath="bedNumber" label="Betten" type="number" />
          <OrderField<Address> path="to" nestedPath="wardrobeWidth" label="Schränke-Gesamtbreite, m" type="number" />
        </AppCard>
      </GridItem>
      <GridItem md={4} xs={12}>
        <AppCard title="Kartons">
          <OrderField path="boxNumber" label="Kartons" type="number" />
          <OrderField path="kleiderboxNumber" label="Kleiderboxen" type="number" />
        </AppCard>
      </GridItem>
      <GridItem md={4} xs={12}>
        <AppCard title="Besondere Gegenstände">
          <Alert severity="info">Der errechnete Umzugsvolumen beinhaltet KEINE "besonderen Gegenstände"</Alert>
          <OrderField path="expensive" label="Antik/Wertvoll angegeben?" as="checkbox" />
          {order?.expensiveText && (
            <OrderField path="expensiveText" multiline label="Besonders wertvolle Gegenstände" />
          )}
          <Typography>todo</Typography>
          <OrderField path="heavy" label="Besonders schwer angegeben?" as="checkbox" />
          <Typography>todo</Typography>
          <OrderField path="bulky" label="Sperrige angegeben?" as="checkbox" />
          <Typography>todo</Typography>
        </AppCard>
      </GridItem>

      <GridItem md={8} xs={12}>
        <AppCard title="Möbelliste">
          <Grid container spacing={2}>
            <GridItem>
              <OrderField path="volume" label="Errechnete Umzugsvolumen" type="number" />
            </GridItem>
            <GridItem>
              <OrderImages />
            </GridItem>
          </Grid>

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
      </GridItem>
    </>
  );
}
