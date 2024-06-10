import { Box } from '@mui/system';

import React from 'react';

export function RootBox(props: React.PropsWithChildren) {
  return (
    <Box p={1} m={'auto'} sx={{ maxWidth: '1800px' }} display="flex" flexDirection="column" gap={2}>
      {props.children}
    </Box>
  );
}
