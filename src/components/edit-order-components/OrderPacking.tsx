import { Grid } from '@mui/material';

import { AppCard } from '../shared/AppCard';
import { AbstractOrderService } from './AbstractOrderService';

export default function OrderPacking() {
  return (
    <Grid item xs={12} md={6}>
      <AppCard title="Verpackung">
        <AbstractOrderService tag="Packmaterial" />
      </AppCard>
    </Grid>
  );
}
