import { Grid2 } from '@mui/material';

import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';
import { AbstractOrderService } from './AbstractOrderService';

export default function OrderServices() {
  return (
    <Grid2 size={{ xs: 12, md: 6 }}>
      <AppCard title="Leistungen">
        <AbstractOrderService tag="Bohrarbeiten" />
      </AppCard>
    </Grid2>
  );
}
