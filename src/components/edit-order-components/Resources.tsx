import { Grid } from '@mui/material';

import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

export default function Resources() {
  return (
    <Grid item xs={4}>
      <AppCard title="Träger und LKW">
        <OrderField path="workersNumber" label="Träger" type="number" />
        <OrderField path="transporterNumber" label="LKW 3.5" type="number" />
        <OrderField path="t75" label="LKW 7.5" type="number" />
      </AppCard>
    </Grid>
  );
}
