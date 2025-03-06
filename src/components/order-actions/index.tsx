import { Divider, Stack } from '@mui/material';

import { EmailActions } from '../../features/email/components/actions/EmailActions';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import CopyOrderAction from './CopyOrderAction';
import { DeleteOrderAction } from './DeleteOrderAction';
import { PrintOrderAction } from './PrintOrderAction';
import { SaveOrderAction } from './SaveOrderAction';

export function OrderEditActions() {
  const order = useCurrentOrder();
  if (order === null) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
      <SaveOrderAction />
      <CopyOrderAction />
      <PrintOrderAction />
      <EmailActions />
      <DeleteOrderAction />
    </Stack>
  );
}
