import { Grid } from '@mui/material';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

import { Customer } from 'um-types';

export function CustomerWidget() {
  const order = useCurrentOrder();

  if (order == null) {
    return null;
  }

  const { customer } = order;

  const hasEmail = typeof customer.email !== 'undefined';
  return (
    <Grid item xs={5} xl={3}>
      <AppCard title="Kundendaten">
        <OrderField<Customer> path="customer" nestedPath="company" label="Firma" />
        <OrderField<Customer>
          label="Anrede"
          path="customer"
          nestedPath="salutation"
          select
          selectOptions={['Herr', 'Frau', '-']}
        />
        <OrderField<Customer> label="Vorname" path="customer" nestedPath="firstName" />
        <OrderField<Customer> label="Name" path="customer" nestedPath="lastName" />
        {hasEmail ? (
          <OrderField<Customer> label="E-Mail" path="customer" nestedPath="email" />
        ) : (
          <OrderField<Customer> label="E-Mail" path="customer" nestedPath="emailCopy" />
        )}
        <OrderField<Customer> label="Tel" path="customer" nestedPath="telNumber" />
      </AppCard>
    </Grid>
  );
}
