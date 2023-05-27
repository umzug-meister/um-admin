import { GridColDef } from '@mui/x-data-grid';

import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { useAppServices } from '../hooks/useAppServices';
import { AppDispatch } from '../store';
import { deleteService, updateService } from '../store/servicesReducer';
import { AddServiceByTag } from './AddServiceByTag';
import { AppDataGrid } from './shared/AppDataGrid';

import { AppPrice, AppServiceTag, Service } from 'um-types';

const dp = {
  editable: true,
  type: 'number',
};

const TAG: AppServiceTag = 'Price';

export const Offers = () => {
  const offers = useAppServices<AppPrice>(TAG);

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

  const offersColumns: GridColDef[] = useMemo(
    () => [
      { field: 'workers', headerName: 'Mann', ...dp },
      { field: 't35', headerName: '3.5', ...dp },
      { field: 't75', headerName: '7.5', ...dp },
      { field: 'includedHours', headerName: 'Stunden', ...dp },
      { field: 'hourPrice', headerName: 'Stundenpreis', ...dp },
      { field: 'ridingCosts', headerName: 'Anfahrtskosten', ...dp },
      { field: 'sum', headerName: 'Gesamt', ...dp },
    ],
    [],
  );

  return (
    <>
      <AddServiceByTag tag={TAG} />
      <AppDataGrid
        columns={offersColumns}
        data={offers}
        paginationMode="client"
        disablePagination
        allowDeletion
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </>
  );
};
