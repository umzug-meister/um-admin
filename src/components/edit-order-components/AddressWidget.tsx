import { Chip, Grid, Stack } from '@mui/material';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppState } from '../../store';
import OrderField from '../OrderField';

import { Address, Order } from 'um-types';

interface Props {
  path: 'from' | 'to';
}

export default function AddressWidget({ path }: Readonly<Props>) {
  const title = useMemo(() => {
    return path === 'from' ? 'Auszug' : 'Einzug';
  }, [path]);

  const order = useCurrentOrder();

  const addressByPath = order?.[path];

  const parkingSlotCheckBoxError: string | undefined = useMemo(() => {
    if (!addressByPath) {
      return undefined;
    }
    const { address, parkingSlot } = addressByPath;

    if (address && parkingSlot) {
      const isInMuc = ['MÜNCHEN', 'MUNICH', 'MUENCHEN'].some((mucName) => {
        return address.toUpperCase().includes(mucName);
      });
      if (isInMuc) {
        return undefined;
      }
      return 'Halteverbot liegt außerhalb der Stadt!';
    }
    return undefined;
  }, [addressByPath]);

  return (
    <Grid item xs={6} xl={3}>
      <Grid container spacing={2}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}></Grid>

        <Grid item xs={6}>
          <OrderField<Address> label="Altbau" path={path} nestedPath="isAltbau" as="checkbox" />
        </Grid>
        <Grid item xs={6}>
          <OrderField<Address> label="Dachboden" path={path} nestedPath="hasLoft" as="checkbox" />
        </Grid>
      </Grid>
      <Grid item xs={6}>
        {path === 'from' ? (
          <>
            <OrderField<Address> label="Demontage" path={path} nestedPath="demontage" as="checkbox" />
          </>
        ) : (
          <OrderField<Address> label="Montage" path={path} nestedPath="montage" as="checkbox" />
        )}
      </Grid>
      {path === 'from' ? (
        <>
          <Grid item xs={12}>
            <OrderField<Address> label="Küchnenlänge" path={path} nestedPath="kitchenWidth" type="number" />
          </Grid>
          <Grid item xs={12}>
            <OrderField<Address> label="Betten" path={path} nestedPath="bedNumber" type="number" />
          </Grid>
          <Grid item xs={12}>
            <OrderField<Address> label="Schränke" path={path} nestedPath="wardrobeWidth" type="number" />
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12}>
            <OrderField<Address> label="Betten" path={path} nestedPath="bedNumber" type="number" />
          </Grid>
          <Grid item xs={12}>
            <OrderField<Address> label="Schränke" path={path} nestedPath="wardrobeWidth" type="number" />
          </Grid>
        </>
      )}

      <Grid item xs={6}>
        {path === 'from' ? (
          <OrderField<Address> label="Einpacken" path={path} nestedPath="packservice" as="checkbox" />
        ) : (
          <OrderField<Address> label="Auspacken" path={path} nestedPath="packservice" as="checkbox" />
        )}
      </Grid>
      <Grid item xs={12}>
        <OrderField<Address>
          label={path === 'from' ? 'Auszug aus' : 'Einzug in'}
          path={path}
          nestedPath="movementObject"
          select
          selectOptions={movementObjects}
        />
      </Grid>
      <FloorsRenderer path={path} />
      {path === 'from' && (
        <Grid item xs={12}>
          <OrderField<Address> label="Fläche" path={path} nestedPath={'area'} select selectOptions={squares} />
        </Grid>
      )}
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
      <Grid item xs={12}>
        <Stack direction={'row'} spacing={2}>
          {order[path]?.stockwerke?.map((s) => <Chip key={s} label={s} />)}
        </Stack>
      </Grid>
    );
  }
  return null;
};

const movementObjects = ['-', 'Wohnung', 'Haus', 'Keller', 'Lager', 'Büro', 'Garten'];

const etagen = ['UG', 'EG', ...[...new Array(8).keys()].map((k) => `${k + 1}. Etage`), '9+ Etage'];

const squares = ['-', ...[...new Array(15).keys()].map((k) => `${(k + 1) * 10} m²`)];
