import { GridColDef } from '@mui/x-data-grid';

import { useDispatch } from 'react-redux';

import { useAppServices } from '../../hooks/useAppServices';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppDispatch } from '../../store';
import { updateOrderService } from '../../store/appReducer';
import { AppDataGrid } from '../shared/AppDataGrid';

import { AppServiceTag, OrderService } from 'um-types';

interface Props {
  tag: AppServiceTag;
}

export function AbstractOrderService({ tag }: Props) {
  const services = useAppServices(tag).sort((a: any, b: any) => (a.name as string).localeCompare(b.name));
  const order = useCurrentOrder();

  const dispatch = useDispatch<AppDispatch>();

  const getPreis = (serv: OrderService) => {
    const orderServ = order?.services?.find((s) => s.id === serv.id);
    if (orderServ?.price) {
      return <p title="Alter Preis">{orderServ?.price}</p>;
    }
    return serv.price;
  };

  const getColli = (serv: OrderService): number => {
    const orderServ = order?.services?.find((s) => s.id === serv.id);

    return Number(orderServ?.colli || 0);
  };

  const onUpdate = (next: OrderService) => {
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

  return (
    <AppDataGrid
      getRowClassName={({ row }) => {
        const service = row as OrderService;

        if (getColli(service) > 0) {
          return 'bold';
        }
        return '';
      }}
      columns={columns}
      data={services}
      disablePagination
      onUpdate={onUpdate}
    />
  );
}
