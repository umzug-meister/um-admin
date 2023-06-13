import { Box, Grid, Typography } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Accounting } from '../components/Accounting';
import { OrderCalculator } from '../components/OrderCalculator';
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
import { useLoadOrder } from '../hooks/useLoadOrder';

export default function Edit() {
  const order = useLoadOrder();

  const [value, setValue] = useState(0);

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
          <OrderFurniture />
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
          <DateTime />
          <Resources />
          <OrderPrice />
          <OrderOfferSelector />
        </AppGridContainer>
      </TabPanel>

      <TabPanel index={5} value={value}>
        <AppGridContainer>
          <Grid item xs={10}>
            <Grid container spacing={2}>
              <OrderConditionsChips />
              <OrderConditionsGrid />
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <OrderCalculator />
          </Grid>
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
