import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { Badge, BadgeProps, Box, Button, styled } from '@mui/material';
import { GridBaseColDef } from '@mui/x-data-grid/internals';

import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Urls } from '../api/Urls';
import { appRequest } from '../api/fetch-client';
import { AppDataGrid } from '../components/shared/AppDataGrid';
import { AppDateCell } from '../components/shared/AppDateCell';
import { RootBox } from '../components/shared/RootBox';
import SearchBar from '../components/shared/SearchBar';
import { getPrintableDate } from '../utils/utils';

import { Order } from 'um-types';
import { EditOrderButton } from '../components/EditOrderButton';

const PAGE_SIZE = 10;

const generator = (function* () {
  let i = 1;
  while (true) {
    yield i;
    i++;
  }
})();

export default function Orders() {
  const [disablePagination, setDisablePagination] = useState(false);

  const [reset, setReset] = useState(0);

  const [data, setData] = useState<Order[]>([]);

  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams({ page: '1' });

  const navigate = useNavigate();

  const onSearch = useCallback(
    (searchValue: string) => {
      const id = Number(searchValue);

      setLoading(true);
      setDisablePagination(true);
      if (isNaN(id)) {
        appRequest('get')(Urls.orderSearch(searchValue))
          .then((orders) => {
            if (Array.isArray(orders)) {
              setData(orders);
            } else {
              setData([]);
            }
          })
          .finally(() => setLoading(false));
      } else {
        appRequest('get')(Urls.orderById(id))
          .then((order) => {
            if (order) {
              navigate(`edit/${id}`);
            } else {
              setData([]);
            }
          })
          .catch((e) => {
            console.error(e);
            setData([]);
          })
          .finally(() => setLoading(false));
      }
    },
    [navigate],
  );

  const currentPage = Number(searchParams.get('page')) || 1;

  const setPage = useCallback(
    (page: number) => {
      setSearchParams({ page: String(page) });
    },
    [setSearchParams],
  );

  const onClear = useCallback(() => {
    setPage(1);
    setDisablePagination(false);
    const next = generator.next().value;
    setReset(next);
  }, [setPage]);

  useEffect(() => {
    setLoading(true);
    appRequest('get')(Urls.orders(currentPage, PAGE_SIZE))
      .then(setData)
      .finally(() => setLoading(false));
  }, [currentPage, reset]);

  const orderColumns: GridBaseColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        type: 'number',
        width: 120,
        renderCell: ({ row }) => {
          const { id, lupd } = row as Order;
          return (
            <StyledBadge color="warning" variant="dot" invisible={!lupd}>
              <EditOrderButton id={id} />
            </StyledBadge>
          );
        },
      },
      {
        field: 'src',
        headerName: 'Quelle',
        width: 150,
      },
      {
        field: 'customer',
        flex: 1,
        headerName: 'Kunde',
        align: 'left',
        renderCell: ({ row }) => {
          const { customer } = row as Order;
          if (!customer) {
            return '';
          }
          if (customer.company) {
            return customer.company;
          }
          return `${customer.salutation || ''} ${customer.firstName || ''} ${customer.lastName || ''}`;
        },
      },
      {
        field: 'date',
        headerName: 'Datum',
        renderCell({ value }) {
          return getPrintableDate(value);
        },
      },
      {
        field: 'from',
        headerName: 'Auszugsadresse',
        align: 'left',
        flex: 1,
        renderCell: ({ row }) => {
          const { from } = row as Order;
          return from?.address || '';
        },
      },
      {
        field: 'ignore1',
        headerName: 'HVZ',
        width: 25,
        renderCell: ({ row }) => {
          const { from } = row as Order;

          return from?.parkingSlot ? (
            <CenteredGridIcons>
              <CheckOutlinedIcon color="success" />
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
          const { to } = row as Order;
          return to?.address || '';
        },
      },
      {
        field: 'ignore2',
        headerName: 'HVZ',
        width: 25,
        renderCell: ({ row }) => {
          const { to } = row as Order;

          return to?.parkingSlot ? (
            <CenteredGridIcons>
              <CheckOutlinedIcon color="success" />
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
        field: 'timeBased',
        width: 80,
        headerName: 'Stunden',
        renderCell: ({ row }) => {
          const { timeBased } = row as Order;
          return timeBased?.hours || '';
        },
      },
      {
        field: 'transporterNumber',
        headerName: 'LKW 3,5t',
        width: 80,
      },

      {
        field: 'lupd',
        headerName: 'Bearbeitet',
        renderCell({ value }) {
          if (!value) {
            return null;
          } else if (typeof value === 'string' && value.includes(',')) {
            // already readyble
            return value;
          } else if (typeof value === 'string' && value.includes('T')) {
            return <AppDateCell date={new Date(value)} />;
          } else {
            return <AppDateCell date={new Date(Number(value))} />;
          }
        },
      },
      {
        headerName: 'Rechnung',
        field: 'rechnung',
        renderCell({ value }) {
          if (value) {
            return (
              <CenteredGridIcons>
                <ReceiptLongOutlinedIcon color="success" />
              </CenteredGridIcons>
            );
          }
          return null;
        },
      },
    ],
    [],
  );

  return (
    <RootBox>
      <SearchBar placeholder="Suche..." onClear={onClear} onSearch={onSearch}>
        <Box display="flex" flex={1} justifyContent="flex-end">
          <Link to="/edit/-1">
            <Button startIcon={<ModeEditOutlineOutlinedIcon />} size="medium" variant="contained">
              Neuer Auftrag
            </Button>
          </Link>
        </Box>
      </SearchBar>
      <AppDataGrid
        loading={loading}
        disablePagination={disablePagination}
        data={data}
        columns={orderColumns}
        setPaginationModel={(model) => setPage(model.page)}
        paginationModel={{ pageSize: PAGE_SIZE, page: Number(searchParams.get('page')) }}
      />
    </RootBox>
  );
}

function CenteredGridIcons(props: Readonly<PropsWithChildren>) {
  return (
    <Box display="flex" justifyContent="center" height={'100%'} alignItems="center">
      {props.children}
    </Box>
  );
}

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 80,
    top: 23,
    border: `2px solid ${theme.palette.background.paper}`,
    borderRadius: '50%',
    padding: '5px',
  },
}));
