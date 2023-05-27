import { GridColDef } from '@mui/x-data-grid';

import { useDispatch } from 'react-redux';

import { useAppServices } from '../../hooks/useAppServices';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppDispatch } from '../../store';
import { updateOrderService } from '../../store/appReducer';
import { AppDataGrid } from '../shared/AppDataGrid';

import { AppService, AppServiceTag } from 'um-types';

interface Props {
  tag: AppServiceTag;
}

export function AbstractOrderService({ tag }: Props) {
  const services = useAppServices(tag);
  const order = useCurrentOrder();

  const dispatch = useDispatch<AppDispatch>();

  const getPreis = (serv: AppService) => {
    const orderServ = order?.services?.find((s) => s.id === serv.id);
    if (orderServ?.price) {
      return <i title="Alter Preis">{orderServ?.price}</i>;
    }
    return serv.price;
  };

  const getColli = (serv: AppService) => {
    const orderServ = order?.services?.find((s) => s.id === serv.id);
    return orderServ?.colli || 0;
  };

  const onUpdate = (next: AppService) => {
    dispatch(updateOrderService({ service: next }));
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      flex: 1,
      headerName: 'Name',
    },
    {
      field: 'price',
      headerName: 'Preis',
      renderCell({ row }) {
        return getPreis(row);
      },
    },
    {
      field: 'colli',
      headerName: 'Anzahl',
      editable: true,
      renderCell({ row }) {
        return getColli(row);
      },
    },
  ];

  return <AppDataGrid columns={columns} data={services} disablePagination onUpdate={onUpdate} />;
}
