import { Grid } from '@mui/material';

import { AppCard } from '../shared/AppCard';
import { AbstractOrderService } from './AbstractOrderService';

export default function OrderServices() {
  return (
    <Grid item xs={12} md={6}>
      <AppCard title="Leistungen">
        <AbstractOrderService tag="Bohrarbeiten" />
      </AppCard>
    </Grid>
  );
}
