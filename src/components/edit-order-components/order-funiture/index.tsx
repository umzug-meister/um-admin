import { Alert, Grid2, Tabs } from '@mui/material';
import Tab from '@mui/material/Tab';

import { useState } from 'react';

import { useCurrentOrder } from '../../../hooks/useCurrentOrder';
import OrderField from '../../OrderField';
import { AppCard } from '../../shared/AppCard';
import { AppGridContainer } from '../../shared/AppGridContainer';
import { GridItem } from '../../shared/GridItem';
import { TabPanel } from '../../shared/TabPanel';
import OrderImages from '../OrderImages';
import { OrderFurnitureList } from '../order-furniture-list/OrderFurnitureList';
import { CustomItemsList } from './CustomItemsList';

import { Address } from '@umzug-meister/um-core';

export function OrderFurniture() {
  const order = useCurrentOrder();
  const [value, setValue] = useState(order?.ownItems ? 1 : 0);

  const size = { xs: 12, md: 4 };
  return (
    <AppGridContainer>
      <GridItem size={size}>
        <AppCard title="Auszug">
          <OrderField<Address> path="from" nestedPath="packservice" label="Einpacken erwünscht?" as="checkbox" />
          <OrderField<Address> path="from" nestedPath="demontage" label="Abbau erwünscht?" as="checkbox" />
          <OrderField<Address> path="from" nestedPath="bedNumber" label="Betten" type="number" />
          <OrderField<Address> path="from" nestedPath="wardrobeWidth" label="Schränke-Gesamtbreite, m" type="number" />
          <OrderField<Address> path="from" nestedPath="kitchenWidth" label="Küche-Gesamtbreite, m" type="number" />
        </AppCard>
      </GridItem>
      <GridItem size={size}>
        <AppCard title="Einzug">
          <OrderField<Address> path="to" nestedPath="packservice" label="Auspacken erwünscht?" as="checkbox" />
          <OrderField<Address> path="to" nestedPath="montage" label="Aufbau erwünscht?" as="checkbox" />
        </AppCard>
      </GridItem>
      <GridItem size={size}>
        <AppCard title="Kartons">
          <OrderField path="boxNumber" label="Kartons" type="number" />
          <OrderField path="kleiderboxNumber" label="Kleiderboxen" type="number" />
        </AppCard>
      </GridItem>
      <GridItem size={size}>
        <AppCard title="Besondere Gegenstände">
          <Alert severity="info">Das berechnete Umzugsvolumen beinhaltet KEINE "besonderen Gegenstände"</Alert>
          <OrderField path="expensive" label="Antik/Wertvoll angegeben?" as="checkbox" />
          {order?.expensiveText && (
            <OrderField path="expensiveText" multiline label="Besonders wertvolle Gegenstände" />
          )}
          <CustomItemsList customItems={order?.expensiveItems} title="Antike" />
          <OrderField path="heavy" label="Besonders schwer angegeben?" as="checkbox" />
          <CustomItemsList customItems={order?.heavyItems} title="Schwere" />
          <OrderField path="bulky" label="Sperrige angegeben?" as="checkbox" />
          <CustomItemsList customItems={order?.bulkyItems} title="Sperrige" />
        </AppCard>
      </GridItem>

      <GridItem size={{ md: 8, xs: 12 }}>
        <AppCard title="Möbelliste">
          <Grid2 container spacing={2}>
            <GridItem>
              <OrderField path="volume" label="berechnetes Umzugsvolumen" type="number" />
            </GridItem>
            <GridItem>
              <OrderImages />
            </GridItem>
          </Grid2>

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
    </AppGridContainer>
  );
}
