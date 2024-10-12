import { createTheme } from '@mui/material/styles';
import { deDE } from '@mui/x-data-grid/locales';

const theme = createTheme(
  {
    palette: {
      background: {
        default: '#F3F6F9',
        paper: '#fff',
      },
      primary: {
        main: '#007FFF',
      },

      secondary: {
        main: '#8c8c8c',
      },
    },
  },
  deDE,
);

export default theme;
