import { Divider, Stack } from '@mui/material';

import CopyOrderAction from './CopyOrderAction';
import { DeleteOrderAction } from './DeleteOrderAction';
import { EmailTextAction } from './EmailTextAction';
import { PrintOrderAction } from './PrintOrderAction';
import { SaveOrderAction } from './SaveOrderAction';

export function OrderEditActions() {
  return (
    <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
      <Divider orientation="vertical" />

      <Stack direction="row" spacing={2}>
        <SaveOrderAction />
        <CopyOrderAction />
      </Stack>

      <Stack direction="row" spacing={2}>
        <PrintOrderAction />
        <EmailTextAction />
      </Stack>

      <DeleteOrderAction />
      <Divider orientation="vertical" />
    </Stack>
  );
}
