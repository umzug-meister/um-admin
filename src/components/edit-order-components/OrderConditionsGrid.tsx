import { Grid2 } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppDispatch } from '../../store';
import { updateOrderProps } from '../../store/appReducer';
import LeistungEdit from '../LeistungEdit';
import { AppCard } from '../shared/AppCard';

import { MLeistung } from '@umzug-meister/um-core';

export function OrderConditionsGrid() {
  const order = useCurrentOrder();

  const dispatch = useDispatch<AppDispatch>();

  const update = useCallback(
    (lst: MLeistung[]) => {
      dispatch(updateOrderProps({ path: ['leistungen'], value: lst }));
    },
    [dispatch],
  );

  if (!order) {
    return null;
  }

  const { leistungen } = order;
  return (
    <Grid2 size={12}>
      <AppCard title="Im Auftrag enthalten">
        <LeistungEdit leistungen={leistungen} update={update} />
      </AppCard>
    </Grid2>
  );
}
