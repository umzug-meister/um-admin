import { Divider, Stack } from '@mui/material';

import { EmailActions } from '../../features/email/components/actions/EmailActions';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import CopyOrderAction from './CopyOrderAction';
import { DeleteOrderAction } from './DeleteOrderAction';
import { PrintOrderAction } from './PrintOrderAction';
import { SaveOrderAction } from './SaveOrderAction';
import UploadAction from './UploadAction';

export function OrderEditActions() {
  const order = useCurrentOrder();
  if (order === null) {
    return null;
  }

  return (
    <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
      <Divider orientation="vertical" />

      <Stack direction="row" spacing={2}>
        <SaveOrderAction />
        <CopyOrderAction />
      </Stack>

      <Stack direction="row" spacing={2}>
        <PrintOrderAction />
      </Stack>
      <Stack direction="row">
        <EmailActions />
      </Stack>

      <DeleteOrderAction />
    </Stack>
  );
}
