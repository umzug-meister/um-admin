import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { Box, Tooltip } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Urls } from '../api/Urls';
import { appRequest } from '../api/fetch-client';
import { EditOrderButton } from '../components/EditOrderButton';
import { AppDataGrid } from '../components/shared/AppDataGrid';
import { AppDateCell } from '../components/shared/AppDateCell';
import { RootBox } from '../components/shared/RootBox';
import OrderSearchBar from '../components/shared/search/OrderSearchBar';
import { searchOrder } from '../components/shared/search/search-order-fn';
import { getCustomerFullname, getPrintableDate } from '../utils/utils';

import { Order } from '@umzug-meister/um-core';

const PAGE_SIZE = 10;

export default function Orders() {
  const [data, setData] = useState<Order[]>([]);

  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams({ page: '1' });

  const navigate = useNavigate();

  const onSearchFn = searchOrder(() => setLoading(false));

  function onSearch(searchValue: string) {
    setLoading(true);
    onSearchFn(searchValue).then((orders) => {
      if (orders.length === 1 && !isNaN(Number(searchValue))) {
        const id = orders[0].id;
        navigate(`/edit/${id}`);
      } else {
        setData(orders);
      }
    });
  }

  const currentPage = Number(searchParams.get('page')) || 1;

  function loadOrders(page: number) {
    setLoading(true);
    appRequest('get')(Urls.orders(page, PAGE_SIZE))
      .then(setData)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage]);

  const setPage = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  const onClear = () => {
    setPage(1);
    loadOrders(1);
  };

  const orderColumns: GridColDef<Order>[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        type: 'number',
        width: 100,
        renderCell: ({ value }: GridRenderCellParams<Order, number>) => <EditOrderButton id={value} />,
      },
      {
        field: 'src',
        headerName: 'Quelle',
        width: 100,
      },
      {
        field: 'customer',
        flex: 1,
        headerName: 'Kunde',
        align: 'left',
        renderCell: ({ row }) => getCustomerFullname(row),
      },
      {
        field: 'date',
        headerName: 'Datum',
        renderCell: ({ value }) => getPrintableDate(value),
      },
      {
        field: 'from',
        headerName: 'Auszugsadresse',
        align: 'left',
        flex: 1,
        renderCell: ({ row }) => {
          const { from } = row;
          return from?.address || '';
        },
      },
      {
        field: 'ignore1',
        headerName: 'HVZ',
        width: 25,
        renderCell: ({ row }) => {
          const { from } = row;

          return from?.parkingSlot ? (
            <CenteredGridIcons>
              <CheckCircleIcon color="success" />
            </CenteredGridIcons>
          ) : null;
        },
      },
      {
        field: 'to',
        headerName: 'Einzugsadresse',
        align: 'left',
        flex: 1,
        renderCell: ({ row }) => {
          const { to } = row;
          return to?.address || '';
        },
      },
      {
        field: 'ignore2',
        headerName: 'HVZ',
        width: 25,
        renderCell: ({ row }) => {
          const { to } = row;

          return to?.parkingSlot ? (
            <CenteredGridIcons>
              <CheckCircleIcon color="success" />
            </CenteredGridIcons>
          ) : null;
        },
      },
      {
        field: 'workersNumber',
        headerName: 'Mann',
        width: 60,
      },
      {
        field: 'transporterNumber',
        headerName: '3,5t',
        width: 60,
      },
      {
        field: 'timeBased',
        width: 60,
        headerName: 'Std.',
        renderCell: ({ row }) => {
          const { timeBased } = row;
          return timeBased?.hours || '';
        },
      },

      {
        field: 'lupd',
        headerName: 'Bearbeitet',
        renderCell({ value }) {
          if (!value) {
            return null;
          } else if (typeof value === 'string' && value.includes(',')) {
            // already readable
            return value;
          } else if (typeof value === 'string' && value.includes('T')) {
            return <AppDateCell date={new Date(value)} />;
          } else {
            return <AppDateCell date={new Date(Number(value))} />;
          }
        },
      },
      {
        headerName: 'Info',
        field: '_',
        renderCell({ row }) {
          return (
            <CenteredGridIcons>
              {row.isCopyOf && (
                <Tooltip title={`Kopie von ${row.isCopyOf}`}>
                  <CopyAllOutlinedIcon />
                </Tooltip>
              )}
              {row.rechnung && (
                <Tooltip title="Rechnung vorhanden">
                  <ReceiptLongOutlinedIcon />
                </Tooltip>
              )}
            </CenteredGridIcons>
          );
        },
      },
    ],
    [],
  );

  return (
    <RootBox>
      <Box width={'330px'}>
        <OrderSearchBar onClear={onClear} onSearch={onSearch} />
      </Box>
      <AppDataGrid
        getRowClassName={(params) => {
          const order = params.row as Order;
          return order.lupd ? '' : 'bold';
        }}
        loading={loading}
        disablePagination={false}
        data={data}
        columns={orderColumns}
        setPaginationModel={(model) => setPage(model.page)}
        paginationModel={{
          pageSize: PAGE_SIZE,
          page: Number(searchParams.get('page')),
        }}
      />
    </RootBox>
  );
}
function CenteredGridIcons(props: Readonly<PropsWithChildren>) {
  return (
    <Box display="flex" gap={0.5} height={'100%'} alignItems="center">
      {props.children}
    </Box>
  );
}
