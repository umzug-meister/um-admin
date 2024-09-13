import { Grid2 } from '@mui/material';
import { PropsWithChildren } from 'react';

export function AppGridContainer({ children }: Readonly<PropsWithChildren>) {
  return (
    <Grid2 container spacing={2}>
      {children}
    </Grid2>
  );
}
