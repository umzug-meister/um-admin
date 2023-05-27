import { GridColDef } from '@mui/x-data-grid';

const defaultColProps = {
  filterable: false,
  sortable: false,
  disableColumnMenu: true,
};

export const prepareCols = (cols: GridColDef[]) => {
  return cols.map((cd) => ({ ...defaultColProps, ...cd }));
};
