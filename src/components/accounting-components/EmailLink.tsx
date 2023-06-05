import { Box, Button } from '@mui/material';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { anrede } from '../../utils/utils';

export default function EmailLink() {
  const order = useCurrentOrder();
  if (!order) {
    return null;
  }
  const { customer } = order;
  const mailto = customer.email || customer.emailCopy;

  if (!mailto) {
    return null;
  }

  const body = `${anrede(customer)}%0D%0AIm Anhang befindet sich Ihre Rechnung.%0D%0A`;

  const href = `mailto:${mailto}?subject=Ihre Rechnung&body=${body}`;

  return (
    <Box>
      <a href={href}>
        <Button>Email</Button>
      </a>
    </Box>
  );
}
