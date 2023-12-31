import { GridProps, Grid } from '@mui/material';
import { PropsWithChildren } from 'react';

export function GridItem(props: Readonly<PropsWithChildren<GridProps>>) {
  return (
    <Grid item xs={6} {...props}>
      {props.children}
    </Grid>
  );
}
