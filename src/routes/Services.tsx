import { Box, Divider, Grid2, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { AddService } from '../components/AddService';
import { OptionInput } from '../components/OptionInput';
import { AppCard } from '../components/shared/AppCard';
import { AppDataGrid } from '../components/shared/AppDataGrid';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import { useAppServices } from '../hooks/useAppServices';
import { AppDispatch } from '../store';
import { deleteService, updateService } from '../store/servicesReducer';

import { AppPacking, AppServiceTag, Service } from '@umzug-meister/um-core';

const TAG: AppServiceTag = 'Bohrarbeiten';
const aProps = {
  type: 'number' as const,
  endAdornment: '€',
};

const servicesolumns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name', editable: true, flex: 1 },
  { field: 'price', headerName: 'Preis', editable: true, type: 'number' },
  { field: 'sort', headerName: 'Sortierung', editable: true, type: 'number' },
  {
    field: 'show',
    headerName: 'In der Form anzeigen',
    editable: true,
    type: 'boolean',
  },
];

export default function Services() {
  const packings = useAppServices<AppPacking>(TAG);
  const sortedPackings = packings.toSorted((a, b) => (a.sort || 0) - (b.sort || 0));

  const dispatch = useDispatch<AppDispatch>();

  const onUpdate = useCallback(
    (serv: Service) => {
      dispatch(updateService(serv));
    },
    [dispatch],
  );

  const onDelete = useCallback(
    (id: number) => {
      dispatch(deleteService(id));
    },
    [dispatch],
  );

  return (
    <AppGridContainer>
      <Grid2 size={8}>
        <AppCard title="Leistungen">
          <AddService service={{ tag: TAG }} />
          <AppDataGrid
            columns={servicesolumns}
            data={sortedPackings}
            paginationMode="client"
            disablePagination
            allowDeletion
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </AppCard>
      </Grid2>
      <Grid2 size={4}>
        <AppCard title="Preise">
          <Typography variant="subtitle2">AGB</Typography>

          <OptionInput name="aBettDeMon" label="Bett Abbau" {...aProps} />
          <OptionInput name="aBoxPack" label="Ein Karton zusätzlich einpacken oder auspacken" {...aProps} />
          <OptionInput name="acbm" label="Je zusätzliche m³" {...aProps} />
          <OptionInput name="aetage" label="Je zusätzliche Etage" {...aProps} />
          <OptionInput name="akitmon" label="Küche Abbau je Meter" {...aProps} />
          <OptionInput name="ameter" label="Je zuätzliche 10 Meter Laufweg" {...aProps} />
          <OptionInput name="awardmon" label="Schrank Ab- und Aufbau je Meter" {...aProps} />
          <OptionInput name="disposalBasicPrice" label="Abfall Abfuhr Pauschale" {...aProps} />
          <OptionInput name="disposalCbmPrice" label="Preis je m³ Abfall" {...aProps} />
          <Box p={1}>
            <Divider />
          </Box>
          <Typography variant="subtitle2">Konfigurator</Typography>

          <OptionInput name="kmPrice" label="Kilometer Preis" {...aProps} />
          <OptionInput name="hvzPrice" label="Halteverbotszone Preis" {...aProps} />
        </AppCard>
      </Grid2>
    </AppGridContainer>
  );
}
