import { Grid } from '@mui/material';

import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

import { TimeBasedPrice } from '@umzug-meister/um-core';

export default function Resources() {
  return (
    <Grid size={4}>
      <AppCard title="Träger und LKW">
        <OrderField path="workersNumber" label="Träger" type="number" />
        <Grid container spacing={2}>
          <Grid size={12}>
            <OrderField path="transporterNumber" label="LKW 3.5" type="number" />
          </Grid>
        </Grid>
        <OrderField<TimeBasedPrice> path="timeBased" type="number" nestedPath="hours" label="Stunden" />
      </AppCard>
    </Grid>
  );
}
