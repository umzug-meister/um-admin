import { Grid } from '@mui/material';

import React from 'react';

import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

export default function OrderSources() {
  return (
    <Grid item xs={2}>
      <AppCard title="">
        <OrderField path="check24" as="checkbox" label="Check24" />
        <OrderField path="myhammer" as="checkbox" label="MyHammer" />
      </AppCard>
    </Grid>
  );
}
