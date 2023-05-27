import { Backdrop, CircularProgress } from '@mui/material';

export function Fallback() {
  return (
    <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="warning" />
    </Backdrop>
  );
}
