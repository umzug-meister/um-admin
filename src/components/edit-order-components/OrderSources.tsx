import { Alert, Grid2 } from '@mui/material';

import { orderSrcTypes } from 'um-types/constants';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

export default function OrderSources() {
  const order = useCurrentOrder();
  if (!order) return null;

  return (
    <Grid2 size={2}>
      <AppCard title="Auftragsquelle">
        <OrderField path="src" label="Auftrag" select selectOptions={orderSrcTypes} />
        {order.src === 'individuelle' && (
          <Alert severity="warning">
            Für <strong>Check24, MyHammer, MöbelTransport24</strong> Auftrag setzen.
          </Alert>
        )}
      </AppCard>
    </Grid2>
  );
}
