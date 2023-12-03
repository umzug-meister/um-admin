import { Grid } from '@mui/material';

import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

export function OrderText() {
  return (
    <Grid item xs={6}>
      <AppCard title="Notiz">
        <OrderField path="text" multiline />
        <OrderField path="costsAssumption" as="checkbox" label="Kostenübernahme durch Arbeitsamt" />
      </AppCard>
    </Grid>
  );
}
