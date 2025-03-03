import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { Box, Grid2, IconButton, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { useAppServices } from '../../hooks/useAppServices';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppDispatch } from '../../store';
import { updateOrderProps } from '../../store/appReducer';
import { euroValue } from '../../utils/utils';
import { AppCard } from '../shared/AppCard';
import { AppDataGrid } from '../shared/AppDataGrid';
import OfferNumberRenderer from '../shared/OfferNumberRenderer';

import { AppPrice } from '@umzug-meister/um-core';

export function OrderOfferSelector() {
  const prices = useAppServices<AppPrice>('Price');
  const order = useCurrentOrder();

  const dispatch = useDispatch<AppDispatch>();

  let data = [...prices];

  /* eslint eqeqeq: 0 */
  if (order !== null) {
    const { transporterNumber, workersNumber, timeBased } = order;
    if (workersNumber) {
      data = data.filter((d) => d.workers == workersNumber);
    }
    if (transporterNumber) {
      data = data.filter((d) => d.t35 == transporterNumber);
    }
    if (timeBased?.hours) {
      data = data.filter((d) => d.includedHours == timeBased.hours);
    }
  }

  const setPrice = useCallback(
    (id: number | string) => {
      const offer = prices.find((p) => Number(p.id) === Number(id));
      if (offer) {
        const timeBasedValue = {
          basis: offer.sum,
          hours: offer.includedHours,
          extra: offer.hourPrice,
        };
        dispatch(updateOrderProps({ path: ['timeBased'], value: timeBasedValue }));
        dispatch(updateOrderProps({ path: ['transporterNumber'], value: offer.t35 }));
        dispatch(updateOrderProps({ path: ['workersNumber'], value: offer.workers }));
      }
    },
    [dispatch, prices],
  );

  const columns = useMemo(() => {
    const cols: GridColDef<AppPrice>[] = [
      {
        field: 'workers',
        headerName: 'Mann',
        flex: 1,
        renderCell({ value }) {
          return <OfferNumberRenderer value={value} color="green" />;
        },
      },
      {
        field: 't35',
        headerName: 'LKW 3,5',
        flex: 1,
        renderCell({ value }) {
          return <OfferNumberRenderer value={value} color="red" />;
        },
      },

      {
        field: 'includedHours',
        headerName: 'Stunden',
        flex: 1,
        renderCell({ value }) {
          return <OfferNumberRenderer value={value} color="blue" />;
        },
      },
      {
        field: 'hourPrice',
        headerName: 'Stundenpreis',
        flex: 1,
        renderCell: ({ value }) => euroValue(value),
      },
      {
        field: 'ridingCosts',
        headerName: 'Anfahrtskosten',
        flex: 1,
        renderCell: ({ value }) => euroValue(value),
      },

      {
        field: 'sum',
        headerName: 'Gesamt',
        flex: 1,
        renderCell: ({ row }) => {
          return (
            <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography variant="body2">{euroValue(row.sum)}</Typography>
              <IconButton color="info" onClick={() => setPrice(row.id)}>
                <CheckCircleOutlinedIcon />
              </IconButton>
            </Box>
          );
        },
      },
    ];
    return cols;
  }, [setPrice]);

  return (
    <Grid2 size={12}>
      <AppCard title="Aktuelle Angebote">
        <AppDataGrid columns={columns} data={data} disablePagination paginationMode="client" />
      </AppCard>
    </Grid2>
  );
}
