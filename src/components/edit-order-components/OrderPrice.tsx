import { Box, Chip, Grid, Stack } from '@mui/material';

import { useDispatch } from 'react-redux';

import { AppDispatch } from '../../store';
import { updateOrderProps } from '../../store/appReducer';
import OrderField from '../OrderField';
import { AppCard } from '../shared/AppCard';

import { TimeBasedPrice } from 'um-types';

export default function OrderPrice() {
  const dispatch = useDispatch<AppDispatch>();

  const onChipClick = (value: number) => {
    dispatch(updateOrderProps({ path: ['discount'], value }));
  };

  return (
    <Grid item xs={4}>
      <AppCard title={'Preis'}>
        <OrderField<TimeBasedPrice> path="timeBased" type="number" nestedPath="basis" label="Betrag" />
        <OrderField<TimeBasedPrice> path="timeBased" type="number" nestedPath="extra" label="Stundenpreis" />
        <Grid container>
          <Grid item xs={6}>
            <OrderField path="discount" label="Rabatt" type="number" />
          </Grid>
          <Grid item xs={6}>
            <Box height="100%" display="flex" alignItems="center" justifyContent="center">
              <Stack direction="row" spacing={2}>
                <Chip label="5 %" onClick={() => onChipClick(5)} />
                <Chip label="10 %" onClick={() => onChipClick(10)} />
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </AppCard>
    </Grid>
  );
}
