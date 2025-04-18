import { Grid } from '@mui/material';

import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';
import { AbstractOrderService } from './AbstractOrderService';

export default function OrderServices() {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <AppCard title="Leistungen">
        <OrderField label="Bohrarbeiten erwünscht?" as="checkbox" path="bohrarbeiten" />
        <AbstractOrderService tag="Bohrarbeiten" />
      </AppCard>
    </Grid>
  );
}
