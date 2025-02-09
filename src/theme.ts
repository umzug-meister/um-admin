import { createTheme } from '@mui/material/styles';
import { deDE } from '@mui/x-data-grid/locales';

export const lightTheme = createTheme(
  {
    palette: {
      mode: 'light',
      background: {
        default: '#F3F6F9',
      },
    },
  },
  deDE,
);

export const darkTheme = createTheme(
  {
    palette: {
      mode: 'dark',
      background: {
        default: '#1E1E1E',
      },
    },
  },
  deDE,
);
