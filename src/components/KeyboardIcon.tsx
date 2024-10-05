import { Box } from '@mui/material';
import React from 'react';

export function KeyboardIcon({ label }: { label: React.ReactNode }) {
  return (
    <Box
      sx={{
        fontSize: '12px!important',
        paddingX: 0.5,
        fontFamily: 'monospace',
        border: 2,
        color: 'black',
        borderColor: 'divider',
        borderRadius: 2,
        fontStyle: 'italic',
        textTransform: 'lowercase',
      }}
    >
      {label}
    </Box>
  );
}
