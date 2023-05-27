import { Box } from '@mui/system';

import React from 'react';

export function RootBox(props: React.PropsWithChildren) {
  return (
    <Box p={1} m={'auto'} sx={{ maxWidth: '1800px' }}>
      {props.children}
    </Box>
  );
}
