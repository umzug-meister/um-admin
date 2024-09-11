import { Grid2 as Grid } from '@mui/material';
import { PropsWithChildren } from 'react';

export function AppGridContainer({ children }: Readonly<PropsWithChildren>) {
  return (
    <Grid container spacing={2}>
      {children}
    </Grid>
  );
}
