import { Backdrop, CircularProgress } from '@mui/material';

export function Loading({ open = true }: Readonly<{ open?: boolean }>) {
  return (
    <Backdrop open={open} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer - 1 }}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
}
