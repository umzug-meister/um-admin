import { Box, Typography } from '@mui/material';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';

import { EditOrderButton } from '../EditOrderButton';

export default function CopyOfLink() {
  const order = useCurrentOrder();

  if (order?.isCopyOf) {
    return (
      <Box>
        <Typography variant="body2">
          Original Auftrag: <EditOrderButton target="_blank" id={order.isCopyOf} />
        </Typography>
      </Box>
    );
  }

  return null;
}
