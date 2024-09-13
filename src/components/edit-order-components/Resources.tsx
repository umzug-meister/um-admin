import { Grid2 } from '@mui/material';

import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

import { TimeBasedPrice } from 'um-types';

export default function Resources() {
  return (
    <Grid2 size={4}>
      <AppCard title="Träger und LKW">
        <OrderField path="workersNumber" label="Träger" type="number" />
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
            <OrderField path="transporterNumber" label="LKW 3.5" type="number" />
          </Grid2>
        </Grid2>
        <OrderField<TimeBasedPrice> path="timeBased" type="number" nestedPath="hours" label="Stunden" />
      </AppCard>
    </Grid2>
  );
}
