import { Box, useTheme } from '@mui/material';

import { ReactNode } from 'react';

export function KeyboardIcon({ label }: Readonly<{ label: ReactNode }>) {
  const theme = useTheme();
  return (
    <Box
      display={'flex'}
      sx={{
        width: 'max-content',
        fontSize: '12px!important',
        paddingX: '2px',
        border: 1,
        color: theme.palette.text.disabled,
        backgroundColor: theme.palette.background.default,
        borderColor: 'divider',
        borderRadius: 2,
        textTransform: 'capitalize',
      }}
    >
      {label}
    </Box>
  );
}
