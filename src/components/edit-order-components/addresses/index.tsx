import { Alert, Box, Grid2 as Grid } from '@mui/material';
import { Address } from 'um-types';
import OrderField from '../../OrderField';
import { AppCard } from '../../shared/AppCard';
import { GridItem } from '../../shared/GridItem';

import { etagen, liftTypes, movementObjects, parkingDistances, squares } from 'um-types/constants';
import { useCurrentOrder } from '../../../hooks/useCurrentOrder';
import { FloorsRenderer } from './FloorsRenderer';
import { useMemo } from 'react';

export function Addresses() {
  const order = useCurrentOrder();

  function isInMuc(address: string | undefined): boolean {
    if (!address) {
      return true;
    } else {
      return ['MÜNCHEN', 'MUNICH', 'MUENCHEN'].some((mucName) => address.toUpperCase().includes(mucName));
    }
  }

  const fromAlert = useMemo(
    () => order?.from?.parkingSlot && !isInMuc(order?.from?.address),
    [order?.from?.address, order?.from?.parkingSlot],
  );
  const toAlert = useMemo(
    () => order?.to?.parkingSlot && !isInMuc(order?.to?.address),
    [order?.to?.address, order?.to?.parkingSlot],
  );

  return (
    <Grid container spacing={2}>
      <GridItem>
        <AppCard title="Auszug">
          <OrderField<Address> path="from" label="Adresse" nestedPath="address" enableMaps id="from-address-input" />
          <OrderField<Address>
            path="from"
            label="Entfernung bis zum Parkplatz"
            nestedPath="runningDistance"
            select
            selectOptions={parkingDistances}
          />
          <OrderField<Address> path="from" label="Halteverbot" nestedPath="parkingSlot" as="checkbox" />
          {fromAlert && <Alert severity="warning">Halteverbot liegt außerhalb der Stadt</Alert>}
        </AppCard>
      </GridItem>

      <GridItem>
        <AppCard title="Einzug">
          <OrderField<Address> path="to" label="Adresse" nestedPath="address" enableMaps id="to-address-input" />
          <OrderField<Address>
            path="to"
            label="Entfernung bis zum Parkplatz"
            nestedPath="runningDistance"
            select
            selectOptions={parkingDistances}
          />
          <OrderField<Address> path="to" label="Halteverbot" nestedPath="parkingSlot" as="checkbox" />
          {toAlert && <Alert severity="warning">Halteverbot liegt außerhalb der Stadt</Alert>}
        </AppCard>
      </GridItem>
      <GridItem>
        <AppCard title={null}>
          <OrderField<Address>
            path="from"
            label="Objekt"
            nestedPath="movementObject"
            select
            selectOptions={movementObjects}
          />
          {order?.from?.movementObject === 'Haus' ? (
            <FloorsRenderer path="from" />
          ) : (
            <>
              <OrderField<Address> path="from" label="Etage" nestedPath="floor" select selectOptions={etagen} />
              <OrderField<Address> path="from" label="Aufzug" nestedPath="liftType" select selectOptions={liftTypes} />
              <OrderField<Address> path="from" label="Altbau" nestedPath="isAltbau" as="checkbox" />
            </>
          )}

          <OrderField<Address> path="from" label="Fläche" nestedPath="area" select selectOptions={squares} />
          <OrderField<Address> path="from" label="Zimmer" nestedPath="roomsNumber" />
          <OrderField<Address> path="from" label="Zimmer zum Umziehen" nestedPath="roomsToRelocate" />
        </AppCard>
      </GridItem>
      <GridItem>
        <AppCard title={null}>
          <OrderField<Address>
            path="to"
            label="Objekt"
            nestedPath="movementObject"
            select
            selectOptions={movementObjects}
          />
          {order?.to?.movementObject === 'Haus' ? (
            <FloorsRenderer path="to" />
          ) : (
            <>
              <OrderField<Address> path="to" label="Etage" nestedPath="floor" select selectOptions={etagen} />
              <OrderField<Address> path="to" label="Aufzug" nestedPath="liftType" select selectOptions={liftTypes} />
              <OrderField<Address> path="to" label="Altbau" nestedPath="isAltbau" as="checkbox" />
            </>
          )}
        </AppCard>
      </GridItem>
      <GridItem>
        <AppCard title={null}>
          <Box display="flex" gap="2">
            <OrderField<Address> path="from" label="Dachboden" nestedPath="hasLoft" as="checkbox" />
            <OrderField<Address> path="from" label="Keller" nestedPath="hasBasement" as="checkbox" />
            <OrderField<Address> path="from" label="Garage" nestedPath="hasGarage" as="checkbox" />
          </Box>
        </AppCard>
      </GridItem>
      <GridItem>
        <AppCard title={null}>
          <OrderField<Address> path="to" label="Dachboden" nestedPath="hasLoft" as="checkbox" />
        </AppCard>
      </GridItem>
    </Grid>
  );
}
