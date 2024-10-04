import { Box, Grid2, Tab, Tabs, Typography } from '@mui/material';

import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Accounting } from '../components/Accounting';
import { OrderCalculator } from '../components/OrderCalculator';
import { CustomerWidget } from '../components/edit-order-components/CustomerWidget';
import DateTime from '../components/edit-order-components/DateTime';
import Distance from '../components/edit-order-components/Distance';
import { OrderConditionsChips } from '../components/edit-order-components/order-conditions-chips';
import { OrderConditionsGrid } from '../components/edit-order-components/OrderConditionsGrid';
import OrderOfferSelector from '../components/edit-order-components/OrderOfferSelector';
import OrderPacking from '../components/edit-order-components/OrderPacking';
import OrderPrice from '../components/edit-order-components/OrderPrice';
import OrderServices from '../components/edit-order-components/OrderServices';
import OrderSource from '../components/edit-order-components/OrderSource';
import { OrderText } from '../components/edit-order-components/OrderText';
import Resources from '../components/edit-order-components/Resources';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import { RootBox } from '../components/shared/RootBox';
import { TabPanel } from '../components/shared/TabPanel';
import { useLoadOrder } from '../hooks/useLoadOrder';
import { Addresses } from '../components/edit-order-components/addresses';
import { OrderFurniture } from '../components/edit-order-components/order-funiture';
import { useUpdateCounter } from '../hooks/useUpdateCounter';

export default function Edit() {
  const order = useLoadOrder();

  const [value, setValue] = useState(0);

  useUpdateCounter();

  if (order == null) {
    return (
      <RootBox>
        <Box m="auto" pt={5} width="max-content">
          <Typography align="center" variant="h3">
            Kein Auftrag gefunden
          </Typography>
          <br />
          <Link to="/">Zurück</Link>
        </Box>
      </RootBox>
    );
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
        <Tab label="Umzugsgut" />
        <Tab label="Extras" />
        <Tab label="Basis" />
        <Tab label="Konditionen" />
        <Tab label="Buchhaltung" />
      </Tabs>
      <TabPanel index={0} value={value}>
        <AppGridContainer>
          <CustomerWidget />
          <OrderText />
          <OrderSource />
        </AppGridContainer>
      </TabPanel>
      <TabPanel index={1} value={value}>
        <AppGridContainer>
          <Grid2 size={{ lg: 7, xs: 12 }}>
            <Addresses />
          </Grid2>
          <Grid2 size={{ lg: 5, xs: 12 }}>
            <Distance />
          </Grid2>
        </AppGridContainer>
      </TabPanel>

      <TabPanel index={2} value={value}>
        <OrderFurniture />
      </TabPanel>

      <TabPanel index={3} value={value}>
        <AppGridContainer>
          <OrderPacking />
          <OrderServices />
        </AppGridContainer>
      </TabPanel>

      <TabPanel index={4} value={value}>
        <AppGridContainer>
          <DateTime />
          <Resources />
          <OrderPrice />
          <OrderOfferSelector />
        </AppGridContainer>
      </TabPanel>

      <TabPanel index={5} value={value}>
        <AppGridContainer>
          <Grid2 size={{ xs: 10 }}>
            <Grid2 container spacing={2}>
              <OrderConditionsChips />
              <OrderConditionsGrid />
            </Grid2>
          </Grid2>
          <Grid2 size={{ xs: 2 }}>
            <OrderCalculator />
          </Grid2>
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
