import { createTheme } from '@mui/material/styles';
import { deDE } from '@mui/x-data-grid/locales';

const theme = createTheme(
  {
    palette: {
      background: {
        default: '#F3F6F9',
      },
    },
  },
  deDE,
);

export default theme;
