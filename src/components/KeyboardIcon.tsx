import { Box } from '@mui/material';
import React from 'react';

export function KeyboardIcon({ label }: Readonly<{ label: React.ReactNode }>) {
  return (
    <Box
      display={'flex'}
      sx={{
        width: 'min-content',
        fontSize: '12px!important',
        paddingX: '2px',
        border: 2,
        color: 'grey.600',
        borderColor: 'divider',
        borderRadius: 2,
        textTransform: 'lowercase',
      }}
    >
      {label}
    </Box>
  );
}
