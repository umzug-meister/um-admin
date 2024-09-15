import { Alert, Grid2 } from '@mui/material';

import React from 'react';

import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';
import { OrderSrcType } from 'um-types';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';

export default function OrderSources() {
  const order = useCurrentOrder();
  if (!order) return null;

  const options = stringUnionToArray<OrderSrcType>('individuelle', 'Check24', 'MyHammer', 'MöbelTransport24', '');

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

type ValueOf<T> = T[keyof T];

type NonEmptyArray<T> = [T, ...T[]];

type MustInclude<T, U extends T[]> = [T] extends [ValueOf<U>] ? U : never;

function stringUnionToArray<T>() {
  return <U extends NonEmptyArray<T>>(...elements: MustInclude<T, U>) => elements;
}
