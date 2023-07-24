import { Grid } from '@mui/material';

import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

export const ORDER_TEXT_FIELD_ID = 'order-notice-field';

export function OrderText() {
  return (
    <Grid item xs={6}>
      <AppCard title="Notiz">
        <OrderField path="text" multiline id={ORDER_TEXT_FIELD_ID} />
      </AppCard>
    </Grid>
  );
}
