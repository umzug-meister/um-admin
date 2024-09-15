import { Box, Grid2 } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppServices } from '../hooks/useAppServices';
import { AppDispatch } from '../store';
import { deleteService, updateService } from '../store/servicesReducer';
import { AddService } from './AddService';
import { AppDataGrid } from './shared/AppDataGrid';
import { AppTextField } from './shared/AppTextField';

import { AppPrice, AppServiceTag, Service } from 'um-types';

interface Props {
  t35: number;
  workers: number;
}

const TAG: AppServiceTag = 'Price';

export default function EditOffersCard({ t35, workers }: Readonly<Props>) {
  const offers = useAppServices<AppPrice>(TAG);
  const data = offers.filter((offer) => Number(offer.t35) === t35 && Number(offer.workers) === workers);

  data.sort((a, b) => Number(b.includedHours) - Number(a.includedHours));

  const [ridingCostsValue, setRidingCostsValue] = useState<any>(data[0]?.ridingCosts || 0);
  const [hourPriceValue, setHourPriceValue] = useState<any>(data[0]?.hourPrice || 0);

  const dispatch = useDispatch<AppDispatch>();

  const onDelete = useCallback(
    (id: number) => {
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
        field: 'ridingCosts',
        headerName: 'Anfahrtskosten',
      },
      {
        field: 'hourPrice',
        headerName: 'Stundenpreis',
      },
      {
        field: 'includedHours',
        headerName: 'Stunden',
        editable: true,
      },
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
      <Grid2 pt={4} container spacing={2}>
        <Grid2 size={6}>
          <AppTextField
            InputProps={{ endAdornment: '€' }}
            disabled={data.length === 0}
            label="Anfahrtskosten"
            value={ridingCostsValue}
            onChange={(ev) => setRidingCostsValue(ev.target.value)}
            onBlur={onRidingCostsChange}
          />
        </Grid2>

        <Grid2 size={6}>
          <AppTextField
            disabled={data.length === 0}
            InputProps={{ endAdornment: '€/Std' }}
            label="Stundenpreis"
            value={hourPriceValue}
            onChange={(ev) => setHourPriceValue(ev.target.value)}
            onBlur={onHourPriceChange}
          />
        </Grid2>
      </Grid2>

      <Box paddingY={2}>
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
