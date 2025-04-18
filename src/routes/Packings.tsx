import { Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { AddService } from '../components/AddService';
import { AppCard } from '../components/shared/AppCard';
import { AppDataGrid } from '../components/shared/AppDataGrid';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import { useAppServices } from '../hooks/useAppServices';
import { AppDispatch } from '../store';
import { deleteService, updateService } from '../store/servicesReducer';

import { AppPacking, AppServiceTag, Service } from '@umzug-meister/um-core';

const dp = {
  editable: true,
  type: 'number' as const,
};

const packingsColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name', editable: true },
  { field: 'price', headerName: 'Preis', ...dp },
  { field: 'desc', headerName: 'Beschreibung', editable: true, flex: 1 },
  { field: 'media', headerName: 'Url', editable: true, flex: 1 },
  {
    field: 'show',
    headerName: 'In der Form anzeigen',
    editable: true,
    width: 200,
    type: 'boolean',
  },
  {
    field: 'sort',
    headerName: 'Sortierung',
    editable: true,
    type: 'number',
    width: 150,
  },
];

const TAG: AppServiceTag = 'Packmaterial';

export default function Packings() {
  const packings = useAppServices<AppPacking>(TAG);

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
      <Grid size={12}>
        <AppCard title="Verpackung">
          <AddService service={{ tag: TAG }} />
          <AppDataGrid
            columns={packingsColumns}
            data={packings}
            paginationMode="client"
            onUpdate={onUpdate}
            disablePagination
            allowDeletion
            onDelete={onDelete}
          />
        </AppCard>
      </Grid>
    </AppGridContainer>
  );
}
