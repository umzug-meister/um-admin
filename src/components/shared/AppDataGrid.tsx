import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridFeatureMode,
  GridPaginationModel,
  GridRowClassNameParams,
} from '@mui/x-data-grid';

import { useMemo } from 'react';

import { DeleteButton } from './DeleteButton';
import { Loading } from './Loading';

const defaultColProps = {
  filterable: false,
  sortable: false,
  disableColumnMenu: true,
};

const prepareCols = (cols: GridColDef[]) => {
  return cols.map((cd) => ({ ...defaultColProps, ...cd }));
};

interface Props {
  data: any[];
  columns: GridColDef[];
  paginationModel?: GridPaginationModel;
  paginationMode?: GridFeatureMode;
  disablePagination?: boolean;
  allowDeletion?: true;
  loading?: boolean;
  setPaginationModel?: (model: GridPaginationModel) => void;
  onUpdate?: (next: any) => void;
  onDelete?: (id: number) => void;
  getRowClassName?: (params: GridRowClassNameParams) => string;
}

export function AppDataGrid({
  paginationModel,
  columns,
  data,
  paginationMode = 'server',
  disablePagination,
  allowDeletion,
  loading = false,
  onDelete,
  setPaginationModel,
  onUpdate,
  getRowClassName,
}: Readonly<Props>) {
  const gridColumns = useMemo(() => {
    if (allowDeletion) {
      const deleteCol: GridColDef = {
        field: '__delete',
        headerName: 'Löschen',
        align: 'left',
        renderCell({ row }) {
          return (
            <DeleteButton
              onDelete={() => {
                if (window.confirm('Möchtest du es wirklich löschen?')) {
                  onDelete?.(row.id);
                }
              }}
            />
          );
        },
      };
      return prepareCols([deleteCol, ...columns]);
    }

    return prepareCols(columns);
  }, [columns, allowDeletion, onDelete]);

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      maxHeight={'800px'}
      sx={{
        '& .MuiDataGrid-footerContainer': {
          display: `${disablePagination ? 'none' : 'block'}`,
          borderTop: 'none',
        },
      }}
    >
      <Loading open={loading} />
      <StyledDataGrid
        rowHeight={45}
        getRowClassName={getRowClassName}
        disableRowSelectionOnClick
        columns={gridColumns}
        rows={data}
        rowCount={paginationMode === 'server' ? 10000 : undefined}
        paginationMode={paginationMode}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 100]}
        onCellEditStop={
          ((params, event) => {
            //@ts-ignore
            const value = event?.target?.value;

            const next = { ...params.row };
            next[params.field] = value;
            onUpdate?.(next);
          }) as GridEventListener<'cellEditStop'>
        }
      />
    </Box>
  );
}

const StyledDataGrid = styled(DataGrid)(({ theme }) => {
  return {
    '& .bold': {
      fontWeight: 'bold',
    },
    '& .MuiDataGrid-main': {
      backgroundColor: theme.palette.background.paper,
    },
    '& .MuiDataGrid-footerContainer': {
      backgroundColor: theme.palette.background.paper,
    },
    '& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel, & .MuiTablePagination-selectLabel + .MuiInputBase-root':
      {
        display: 'none !important',
      },
  };
});
