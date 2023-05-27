import { DeleteOutlined } from '@mui/icons-material';
import { Box, Card, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridFeatureMode, GridPaginationModel } from '@mui/x-data-grid';

import { useMemo } from 'react';

const defaultColProps = {
  filterable: false,
  sortable: false,
  disableColumnMenu: true,
};

export const prepareCols = (cols: GridColDef[]) => {
  return cols.map((cd) => ({ ...defaultColProps, ...cd }));
};

interface Props {
  data: any[];
  columns: GridColDef[];
  paginationModel?: GridPaginationModel;
  paginationMode?: GridFeatureMode;
  setPaginationModel?: (model: GridPaginationModel) => void;
  onUpdate?: (next: any) => void;
  disablePagination?: true;
  allowDeletion?: true;
  onDelete?: (id: string) => void;
}

export function AppDataGrid({
  paginationModel,
  columns,
  data,
  paginationMode = 'server',
  disablePagination,
  allowDeletion,
  onDelete,
  setPaginationModel,
  onUpdate,
}: Props) {
  const gridColumns = useMemo(() => {
    if (allowDeletion) {
      const deleteCol: GridColDef = {
        field: '__delete',
        headerName: 'Löschen',
        renderCell({ row }) {
          return (
            <IconButton
              sx={{ ml: '30px' }}
              color="error"
              onClick={() => {
                if (window.confirm('Möchtest du es wirklich löschen?')) {
                  onDelete?.(row.id);
                }
              }}
            >
              <DeleteOutlined />
            </IconButton>
          );
        },
      };
      return prepareCols([deleteCol, ...columns]);
    }

    return prepareCols(columns);
  }, [columns, allowDeletion, onDelete]);

  return (
    <Card elevation={0}>
      <Box
        sx={{
          '& .MuiDataGrid-footerContainer': {
            display: `${disablePagination ? 'none' : 'block'}`,
            borderTop: 'none',
          },
          '& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel, & .MuiTablePagination-selectLabel + .MuiInputBase-root':
            {
              display: 'none !important',
            },
          '& .MuiDataGrid-root': {
            border: 'none',
          },
        }}
      >
        <DataGrid
          localeText={{
            noResultsOverlayLabel: 'Keine Ergebnisse',
          }}
          disableRowSelectionOnClick
          autoHeight
          columns={gridColumns}
          rows={data}
          rowCount={10000}
          paginationMode={paginationMode}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 100]}
          onCellEditStop={(params, event) => {
            //@ts-ignore
            const value = event?.target?.value;

            const next = { ...params.row };
            next[params.field] = value;
            onUpdate?.(next);
          }}
        />
      </Box>
    </Card>
  );
}
