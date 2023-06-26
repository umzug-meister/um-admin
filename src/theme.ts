import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  shape: {
    borderRadius: 6,
  },

  palette: {
    text: {
      primary: '#262626',
    },
    background: {
      default: '#F3F6F9',
      paper: '#fff',
    },
    primary: {
      main: '#007FFF',
      contrastText: '#fff',
    },
    success: {
      main: '#52c41a',
    },
    error: {
      main: '#f5222d',
    },
    warning: {
      main: '#faad14',
    },
    secondary: {
      main: '#8c8c8c',
      contrastText: '#fff',
    },
    mode: 'light',
  },
  typography: {
    fontSize: 13,
    fontFamily: 'Inter',
  },
});

export default theme;
