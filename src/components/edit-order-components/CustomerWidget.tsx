import { Grid2 } from '@mui/material';

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

  const hasEmail = typeof customer?.email !== 'undefined';
  return (
    <Grid2 size={4}>
      <AppCard title="Kundendaten">
        <OrderField<Customer> path="customer" nestedPath="company" label="Firma" />
        <OrderField<Customer>
          label="Anrede"
          path="customer"
          nestedPath="salutation"
          select
          selectOptions={['Herr', 'Frau', '-']}
        />
        <OrderField<Customer> label="Vorname" path="customer" nestedPath="firstName" capitalize />
        <OrderField<Customer> label="Name" path="customer" nestedPath="lastName" capitalize />
        {hasEmail ? (
          <OrderField<Customer> label="E-Mail" path="customer" nestedPath="email" />
        ) : (
          <OrderField<Customer> label="E-Mail" path="customer" nestedPath="emailCopy" />
        )}
        <OrderField<Customer> label="Tel" path="customer" nestedPath="telNumber" />
      </AppCard>
    </Grid2>
  );
}
