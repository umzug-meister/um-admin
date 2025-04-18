import { Alert, Grid } from '@mui/material';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';
import CopyOfLink from './CopyOfLink';
import { OrderTimestamp } from './OrderTimestamp';

import { orderSrcTypes } from '@umzug-meister/um-core/constants';

export default function OrderSource() {
  const order = useCurrentOrder();
  if (!order) return null;

  return (
    <Grid size={2}>
      <AppCard title="Auftrag">
        <OrderTimestamp />
        <CopyOfLink />
        <OrderField path="src" label="Quelle" select selectOptions={orderSrcTypes} />
        {order.src === 'individuelle' && (
          <Alert severity="warning">
            Für <strong>Check24, MyHammer, MöbelTransport24</strong> Auftrag setzen.
          </Alert>
        )}
      </AppCard>
    </Grid>
  );
}
