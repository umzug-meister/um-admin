import { Box, Chip, FormGroup, Grid, Stack } from '@mui/material';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '../../store';
import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

import { Address, Order } from 'um-types';

interface Props {
  path: 'from' | 'to';
}

const movementObjects = ['-', 'Wohnung', 'Haus', 'Keller', 'Lager', 'Büro', 'Garten'];

const parkingDistances = ['-', ...[...new Array(10).keys()].map((k) => `${(k + 1) * 10} m.`)];

const etagen = ['UG', 'EG', ...[...new Array(8).keys()].map((k) => `${k + 1}. Etage`), '9+ Etage'];

export const squares = ['-', ...[...new Array(15).keys()].map((k) => `${(k + 1) * 10} m²`)];

const liftTypes = ['-', 'kein Aufzug', '2 Personen', '4 Personen', '6 Personen', '8+ Personen'];

export default function AddressWidget({ path }: Props) {
  const title = useMemo(() => {
    return path === 'from' ? 'Auszug' : 'Einzug';
  }, [path]);

  return (
    <Grid item xs={6} xl={3}>
      <AppCard title={title}>
        <OrderField<Address> label="Adresse" path={path} nestedPath="address" enableMaps id={`${path}-address-input`} />
        <OrderField<Address>
          label="Entfernung bis zum Parkplatz"
          path={path}
          nestedPath="runningDistance"
          select
          selectOptions={parkingDistances}
        />
        <OrderField<Address> label="Etage" path={path} nestedPath="floor" select selectOptions={etagen} />

        <OrderField<Address> label="Aufzug" path={path} nestedPath="liftType" select selectOptions={liftTypes} />
        <Box display={'flex'} gap="10px">
          <OrderField<Address> label="Altbau" path={path} nestedPath="isAltbau" as="checkbox" />

          <OrderField<Address> label="Dachboden" path={path} nestedPath="hasLoft" as="checkbox" />
        </Box>
        <OrderField<Address> label="Halteverbot" path={path} nestedPath="parkingSlot" as="checkbox" />
        <Box display={'flex'} gap="10px">
          {path === 'from' ? (
            <OrderField<Address> label="Demontage" path={path} nestedPath="demontage" as="checkbox" />
          ) : (
            <OrderField<Address> label="Montage" path={path} nestedPath="montage" as="checkbox" />
          )}
          {path === 'from' ? (
            <OrderField<Address> label="Einpackservice" path={path} nestedPath="packservice" as="checkbox" />
          ) : (
            <OrderField<Address> label="Auspackservice" path={path} nestedPath="packservice" as="checkbox" />
          )}
        </Box>
        <OrderField<Address>
          label={path === 'from' ? 'Auszug aus' : 'Einzug in'}
          path={path}
          nestedPath="movementObject"
          select
          selectOptions={movementObjects}
        />
        <FloorsRenderer path={path} />
        {path === 'from' && (
          <OrderField<Address> label="Fläche" path={path} nestedPath={'area'} select selectOptions={squares} />
        )}
      </AppCard>
    </Grid>
  );
}

const FloorsRenderer = ({ path }: Props) => {
  const order = useSelector<AppState, Order | null>((s) => s.app.current);

  if (order == null) {
    return null;
  }

  if (order[path]?.stockwerke) {
    return (
      <Stack direction={'row'} spacing={2}>
        {order[path]?.stockwerke?.map((s) => (
          <Chip key={s} label={s} />
        ))}
      </Stack>
    );
  }
  return null;
};
