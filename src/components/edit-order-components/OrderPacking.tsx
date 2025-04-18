import { Grid } from '@mui/material';

import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';
import { AbstractOrderService } from './AbstractOrderService';

export default function OrderPacking() {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <AppCard title="Verpackung">
        <OrderField path="needPackings" label="Verpackung erwünscht?" as="checkbox" />
        <AbstractOrderService tag="Packmaterial" />
      </AppCard>
    </Grid>
  );
}
