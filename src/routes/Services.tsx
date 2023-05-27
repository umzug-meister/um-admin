import { Grid } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { AddServiceByTag } from '../components/AddServiceByTag';
import { AppCard } from '../components/shared/AppCard';
import { AppDataGrid } from '../components/shared/AppDataGrid';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import { useAppServices } from '../hooks/useAppServices';
import { AppDispatch } from '../store';
import { deleteService, updateService } from '../store/servicesReducer';

import { AppPacking, AppServiceTag, Service } from 'um-types';

const TAG: AppServiceTag = 'Bohrarbeiten';

const servicesolumns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name', editable: true, flex: 1 },
  { field: 'price', headerName: 'Preis', editable: true, type: 'number' },
];

export default function Services() {
  const packings = useAppServices<AppPacking>(TAG);

  const dispatch = useDispatch<AppDispatch>();

  const onUpdate = useCallback(
    (serv: Service) => {
      dispatch(updateService(serv));
    },
    [dispatch],
  );

  const onDelete = useCallback(
    (id: string) => {
      dispatch(deleteService(id));
    },
    [dispatch],
  );

  return (
    <AppGridContainer>
      <Grid item xs={12}>
        <AppCard title="Leistungen">
          <AddServiceByTag tag={TAG} />
          <AppDataGrid
            columns={servicesolumns}
            data={packings}
            paginationMode="client"
            disablePagination
            allowDeletion
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </AppCard>
      </Grid>
    </AppGridContainer>
  );
}
