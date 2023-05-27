import { Grid } from '@mui/material';

import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

export function OrderText() {
  return (
    <Grid item xs={7} xl={9}>
      <AppCard title="Notiz">
        <OrderField path="text" multiline />
      </AppCard>
    </Grid>
  );
}
