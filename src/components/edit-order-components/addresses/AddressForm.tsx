import { Alert, Box, Typography } from '@mui/material';

import React from 'react';

import { useCurrentOrder } from '../../../hooks/useCurrentOrder';
import OrderField from '../../OrderField';
import { AppCard } from '../../shared/AppCard';
import { FloorsRenderer } from './FloorsRenderer';
import { OrderAddressPath } from './types';

import { Address } from '@umzug-meister/um-core';
import { etagen, liftTypes, movementObjects, parkingDistances, squares } from '@umzug-meister/um-core/constants';

interface AddressFormProps {
  path: OrderAddressPath;
  full?: boolean;
  title: React.ReactNode;
}

function isInMuc(address: string | undefined): boolean {
  if (!address) {
    return true;
  } else {
    return ['MÜNCHEN', 'MUNICH', 'MUENCHEN'].some((mucName) => address.toUpperCase().includes(mucName));
  }
}

export function AddressForm({ path, title, full }: Readonly<AddressFormProps>) {
  const order = useCurrentOrder();

  if (!order) return null;

  const showAlert = order?.[path]?.parkingSlot && !isInMuc(order?.[path]?.address);
  return (
    <AppCard title={title}>
      <OrderField<Address> path={path} label="Adresse" nestedPath="address" enableMaps id={`${path}-address-input`} />
      <OrderField<Address>
        path={path}
        label="Entfernung bis zum Parkplatz"
        nestedPath="runningDistance"
        select
        selectOptions={parkingDistances}
      />
      <OrderField<Address> path={path} label="Halteverbot" nestedPath="parkingSlot" as="checkbox" />

      {showAlert && <Alert severity="warning">Halteverbot liegt außerhalb der Stadt</Alert>}

      <Typography color="info" paddingBottom={2} align="center">
        Gebäude
      </Typography>
      <OrderField<Address>
        path={path}
        label="Objekt"
        nestedPath="movementObject"
        select
        selectOptions={movementObjects}
      />

      {order[path]?.movementObject === 'Haus' ? (
        <FloorsRenderer path={path} />
      ) : (
        <>
          <OrderField<Address> path={path} label="Etage" nestedPath="floor" select selectOptions={etagen} />
          <OrderField<Address> path={path} label="Aufzug" nestedPath="liftType" select selectOptions={liftTypes} />
          <OrderField<Address> path={path} label="Altbau" nestedPath="isAltbau" as="checkbox" />
        </>
      )}

      {full ? (
        <Box display="flex" gap="2">
          <OrderField<Address> path={path} label="Dachboden" nestedPath="hasLoft" as="checkbox" />
          <OrderField<Address> path={path} label="Keller" nestedPath="hasBasement" as="checkbox" />
          <OrderField<Address> path={path} label="Garage" nestedPath="hasGarage" as="checkbox" />
        </Box>
      ) : (
        <OrderField<Address> path={path} label="Dachboden" nestedPath="hasLoft" as="checkbox" />
      )}

      {full && (
        <>
          <Typography color="info" paddingBottom={2} align="center">
            Wohnung
          </Typography>
          <OrderField<Address> path={path} label="Fläche" nestedPath="area" select selectOptions={squares} />
          <OrderField<Address> path={path} label="Zimmer" nestedPath="roomsNumber" />
          <OrderField<Address> path={path} label="Zimmer zum Umziehen" nestedPath="roomsToRelocate" />
        </>
      )}
    </AppCard>
  );
}
