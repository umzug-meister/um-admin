import { Alert, Box, Chip, Grid, Stack } from '@mui/material';

import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppDispatch } from '../../store';
import { updateOrderProps } from '../../store/appReducer';
import { getParseableDate } from '../../utils/utils';
import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

import { TimeBasedPrice } from '@umzug-meister/um-core';
import { differenceInDays } from 'date-fns';

export default function OrderPrice() {
  const dispatch = useDispatch<AppDispatch>();

  const order = useCurrentOrder();

  const recomendation = useMemo(() => {
    if (!order?.date) {
      return null;
    }
    if (order.discount) {
      return null;
    }

    const dateString = getParseableDate(order.date);
    const now = new Date();

    const date = new Date(dateString);
    const diff = differenceInDays(date, now);
    if (diff >= 59) {
      return <Alert severity="info">10% Rabatt empfohlen</Alert>;
    }
    if (diff >= 29) {
      return <Alert severity="info">5% Rabatt empfohlen</Alert>;
    }
    return <Alert severity="warning">Kein Rabatt empfohlen!</Alert>;
  }, [order?.date, order?.discount]);

  const onChipClick = (value: number) => {
    dispatch(updateOrderProps({ path: ['discount'], value }));
  };

  return (
    <Grid size={4}>
      <AppCard title={'Preis'}>
        <OrderField<TimeBasedPrice> path="timeBased" type="number" nestedPath="basis" label="Betrag" />
        <OrderField<TimeBasedPrice> path="timeBased" type="number" nestedPath="extra" label="Stundenpreis" />
        <Grid container>
          <Grid size={6}>
            <OrderField path="discount" label="Rabatt" type="number" />
          </Grid>
          <Grid size={6}>
            <Box height="100%" display="flex" alignItems="center" justifyContent="center">
              <Stack direction="row" spacing={2}>
                <Chip label="5 %" onClick={() => onChipClick(5)} />
                <Chip label="10 %" onClick={() => onChipClick(10)} />
              </Stack>
            </Box>
          </Grid>
        </Grid>
        {recomendation}
      </AppCard>
    </Grid>
  );
}
