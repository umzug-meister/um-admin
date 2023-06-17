import { Box, Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppServices } from '../hooks/useAppServices';
import { AppDispatch } from '../store';
import { deleteService, updateService } from '../store/servicesReducer';
import { AddService } from './AddService';
import { AppDataGrid } from './shared/AppDataGrid';
import { AppTextField } from './shared/AppTextField';
import OfferNumberRenderer from './shared/OfferNumberRenderer';

import { AppPrice, AppServiceTag, Service } from 'um-types';

interface Props {
  t35: number;
  workers: number;
}

const TAG: AppServiceTag = 'Price';

export default function OfferTab({ t35, workers }: Props) {
  const offers = useAppServices<AppPrice>(TAG);
  const data = offers.filter((offer) => Number(offer.t35) === t35 && Number(offer.workers) === workers);

  const [ridingCostsValue, setRidingCostsValue] = useState<any>(data[0]?.ridingCosts || 0);
  const [hourPriceValue, setHourPricevalue] = useState<any>(data[0]?.hourPrice || 0);

  const dispatch = useDispatch<AppDispatch>();

  const onDelete = useCallback(
    (id: string) => {
      dispatch(deleteService(id));
    },
    [dispatch],
  );

  const onUpdate = useCallback(
    (serv: Service) => {
      dispatch(updateService(serv));
    },
    [dispatch],
  );

  const columns: GridColDef[] = useMemo(
    () => [
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
        headerName: '3.5',
        flex: 1,
        renderCell({ value }) {
          return <OfferNumberRenderer value={value} color="red" />;
        },
      },

      {
        field: 'includedHours',
        headerName: 'Stunden',
        editable: true,
        flex: 1,
        renderCell({ value }) {
          return <OfferNumberRenderer value={value} color="blue" />;
        },
      },
      { field: 'hourPrice', headerName: 'Stundenpreis', flex: 1 },
      { field: 'ridingCosts', headerName: 'Anfahrtskosten', flex: 1 },
      { field: 'sum', headerName: 'Gesamt', editable: true },
    ],
    [],
  );

  const service: Partial<Service> = useMemo(() => {
    return { hourPrice: hourPriceValue, ridingCosts: ridingCostsValue, t35, t75: 0, workers, tag: TAG };
  }, [hourPriceValue, ridingCostsValue, t35, workers]);

  const onRidingCostsChange = () => {
    data.forEach((serv) => {
      onUpdate({ ...serv, ridingCosts: Number(ridingCostsValue) });
    });
  };

  const onHourPriceChange = () => {
    data.forEach((serv) => {
      onUpdate({ ...serv, hourPrice: Number(hourPriceValue) });
    });
  };

  return (
    <>
      <Grid pt={4} container gap={2}>
        <Grid item xs={3}>
          <AppTextField
            disabled={data.length === 0}
            label="Anfahrtskosten"
            value={ridingCostsValue}
            onChange={(ev) => setRidingCostsValue(ev.target.value)}
            onBlur={onRidingCostsChange}
          />
        </Grid>

        <Grid item xs={3}>
          <AppTextField
            disabled={data.length === 0}
            label="Stundenpreis"
            value={hourPriceValue}
            onChange={(ev) => setHourPricevalue(ev.target.value)}
            onBlur={onHourPriceChange}
          />
        </Grid>
      </Grid>
      <Box paddingY={4}>
        <AddService service={service} />
      </Box>
      <AppDataGrid
        columns={columns}
        data={data}
        disablePagination
        allowDeletion
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </>
  );
}
