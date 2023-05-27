import { GridColDef } from '@mui/x-data-grid';

const dp = {
  editable: true,
  type: 'number',
};

export const packingsColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name', editable: true, width: 400 },
  { field: 'price', headerName: 'Preis', ...dp },
];
