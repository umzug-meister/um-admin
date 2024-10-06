import { Box } from '@mui/system';

import { PropsWithChildren } from 'react';

export function RootBox({ children }: Readonly<PropsWithChildren>) {
  return (
    <Box p={1} m={'auto'} sx={{ maxWidth: '1800px' }} display="flex" flexDirection="column" gap={2}>
      {children}
    </Box>
  );
}
