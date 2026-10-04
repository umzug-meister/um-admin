import { createTheme } from '@mui/material/styles';
import { deDE } from '@mui/x-data-grid/locales';

const appTarget = import.meta.env.VITE_APP_TARGET || 'umzugruckzuck24';

const mainColor = appTarget === 'umzugruckzuck24' ? '#5db67f' : '#1976d2';

export const lightTheme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: {
        main: mainColor,
      },
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
      primary: {
        main: mainColor,
      },
      background: {
        default: '#1E1E1E',
      },
    },
  },
  deDE,
);

console.log('appTarget:', lightTheme.palette.primary.main);
