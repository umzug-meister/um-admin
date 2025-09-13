import { Box, Divider, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { useDispatch } from 'react-redux';

import { useAppServices } from '../../hooks/useAppServices';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppDispatch } from '../../store';
import { updateOrderService } from '../../store/appReducer';
import { euroValue } from '../../utils/utils';
import { AppDataGrid } from '../shared/AppDataGrid';

import { AppServiceTag, OrderService } from '@umzug-meister/um-core';

interface Props {
  tag: AppServiceTag;
}

export function AbstractOrderService({ tag }: Readonly<Props>) {
  const services = useAppServices<OrderService>(tag).sort((a: any, b: any) => (a.name as string).localeCompare(b.name));
  const order = useCurrentOrder();
  const dispatch = useDispatch<AppDispatch>();

  const currentServiceIds = services?.map((s) => s.id) || [];
  const legacyServices = order?.services?.filter((s) => !currentServiceIds.includes(s.id) && s.tag === tag) || [];

  const getPreis = (serv: OrderService) => {
    const orderServ = order?.services?.find((s) => s.id === serv.id);
    if (orderServ?.price) {
      return <div title="Gebuchter Preis">{euroValue(orderServ.price)}</div>;
    }
    return euroValue(serv.price);
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
    <Box>
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
      {legacyServices?.length > 0 ? (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" color="primary">
            Nicht aktuelle Leistungen
          </Typography>
          <Typography color="textSecondary" variant="body2">
            keine Ausgabe auf PDF
          </Typography>
          <AppDataGrid columns={columns} data={legacyServices} disablePagination onUpdate={onUpdate} />
        </>
      ) : null}
    </Box>
  );
}
