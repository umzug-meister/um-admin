import { Box, Button } from '@mui/material';

import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { anrede } from '../../utils/utils';

export default function EmailLink() {
  const order = useCurrentOrder();
  if (!order) {
    return null;
  }
  const { customer } = order;
  const mailto = customer.email ?? customer.emailCopy;

  const body = [
    anrede(customer),
    ``,
    `Vielen Dank, dass Sie unsere Leistungen in Anspruch genommen haben.`,
    `Im Anhang befindet sich Ihre Rechnung.`,
    ``,
  ];

  const href = `mailto:${mailto}?subject=Ihre Rechnung&body=${body.join('%0D%0A')}`;

  return (
    <Box>
      <a href={href}>
        <Button disableElevation variant="outlined">
          E-Mail
        </Button>
      </a>
    </Box>
  );
}
