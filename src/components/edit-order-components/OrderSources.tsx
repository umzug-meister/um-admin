import { Alert, Grid } from '@mui/material';

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
  ];

  return (
    <Grid item xs={2}>
      <AppCard title="Auftragsquelle">
        <OrderField path="src" label="Auftrag" select selectOptions={options} />
        {order.src === 'individuelle' && <Alert severity="warning">Für Check24 & MyHammer 'Auftrag' setzen!</Alert>}
      </AppCard>
    </Grid>
  );
}
