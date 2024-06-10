import { Grid } from '@mui/material';

import React from 'react';

export function AppGridContainer({ children }: React.PropsWithChildren) {
  return (
    <Grid container spacing={2}>
      {children}
    </Grid>
  );
}
