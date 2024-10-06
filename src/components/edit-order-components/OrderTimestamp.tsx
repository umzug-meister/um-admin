import { Box, Typography } from '@mui/material';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';

export function OrderTimestamp() {
  const order = useCurrentOrder();

  if (!order?.timestamp) return null;
  return (
    <Box>
      <Typography variant="body2">Erstellt am: {new Date(order.timestamp).toLocaleString()}</Typography>
    </Box>
  );
}
