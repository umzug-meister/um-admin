import { Alert, Grid2 } from '@mui/material';

import React from 'react';

import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';
import { OrderSrcType } from 'um-types';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';

export default function OrderSources() {
  const order = useCurrentOrder();
  if (!order) return null;

  const options: OrderSrcType[] = [
    'express',
    'individuelle',
    'obi',
    'check24',
    'myhammer',
    'Moebelliste',
    'UmzugRuckZuck',
    'moebeltransport24',
  ];

  return (
    <Grid2 size={2}>
      <AppCard title="Auftragsquelle">
        <OrderField path="src" label="Auftrag" select selectOptions={options} />
        {order.src === 'individuelle' && (
          <Alert severity="warning">
            Für <strong>Check24, MyHammer, MöbelTransport24</strong> Auftrag setzen.
          </Alert>
        )}
      </AppCard>
    </Grid2>
  );
}
