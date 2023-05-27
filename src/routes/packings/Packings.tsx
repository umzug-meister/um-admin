import { Grid } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { AddServiceByTag } from '../../components/AddServiceByTag';
import { AppCard } from '../../components/shared/AppCard';
import { AppDataGrid } from '../../components/shared/AppDataGrid';
import { AppGridContainer } from '../../components/shared/AppGridContainer';
import { useAppServices } from '../../hooks/useAppServices';
import { AppDispatch } from '../../store';
import { deleteService, updateService } from '../../store/servicesReducer';
import { packingsColumns } from './PackingsColumns';

import { AppPacking, AppServiceTag, Service } from 'um-types';

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
    (id: string) => {
      dispatch(deleteService(id));
    },
    [dispatch],
  );

  return (
    <AppGridContainer>
      <Grid item xs={12}>
        <AppCard title="Verpackung">
          <AddServiceByTag tag={TAG} />
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
