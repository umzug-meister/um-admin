import { Box, keyframes } from '@mui/material';

import React from 'react';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
  transform: scale(1.2);
}
  100% {
    transform: scale(1);
  }
`;

export default function Pulsating({ children }: React.PropsWithChildren) {
  return (
    <Box
      sx={{
        animation: `${pulse} 800ms 2 ease`,
      }}
    >
      {children}
    </Box>
  );
}
