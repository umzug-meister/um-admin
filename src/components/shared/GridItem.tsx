import { Grid, GridProps } from '@mui/material';

import { PropsWithChildren } from 'react';

export function GridItem(props: Readonly<PropsWithChildren<GridProps>>) {
  return (
    <Grid size={6} {...props}>
      {props.children}
    </Grid>
  );
}
