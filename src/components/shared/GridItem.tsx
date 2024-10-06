import { Grid2, Grid2Props } from '@mui/material';

import { PropsWithChildren } from 'react';

export function GridItem(props: Readonly<PropsWithChildren<Grid2Props>>) {
  return (
    <Grid2 size={6} {...props}>
      {props.children}
    </Grid2>
  );
}
