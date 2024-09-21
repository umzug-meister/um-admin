import { Box } from '@mui/material';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';

import { Link } from 'react-router-dom';

export default function CopyOfLink() {
  const order = useCurrentOrder();

  if (order?.isCopyOf) {
    return (
      <Box>
        <Link to={`/edit/${order.isCopyOf}`}>Original Auftrag: {order.isCopyOf}</Link>
      </Box>
    );
  }

  return null;
}
