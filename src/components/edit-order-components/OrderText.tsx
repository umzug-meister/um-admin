import { Alert, Grid } from '@mui/material';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';

import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

export function OrderText() {
  const order = useCurrentOrder();

  return (
    <Grid item xs={6}>
      <AppCard title="Notiz">
        <OrderField path="text" multiline />
        <OrderField path="costsAssumption" as="checkbox" label="Kostenübernahme durch Arbeitsamt" />
        {order?.costsAssumption && (
          <Alert severity="info">Für die Kostenübernahme wird meist ein FESTPREIS Angebot benötigt.</Alert>
        )}
      </AppCard>
    </Grid>
  );
}
