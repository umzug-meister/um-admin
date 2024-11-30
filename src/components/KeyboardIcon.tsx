import { Box } from '@mui/material';

import { ReactNode } from 'react';

export function KeyboardIcon({ label }: Readonly<{ label: ReactNode }>) {
  return (
    <Box
      display={'flex'}
      sx={{
        width: 'max-content',
        fontSize: '12px!important',
        paddingX: '2px',
        border: 1,
        color: 'grey.800',
        backgroundColor: 'white',
        borderColor: 'divider',
        borderRadius: 2,
        textTransform: 'capitalize',
      }}
    >
      {label}
    </Box>
  );
}
