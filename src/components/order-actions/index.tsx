import { Divider, Stack } from '@mui/material';

import CopyOrderAction from './CopyOrderAction';
import { DeleteOrderAction } from './DeleteOrderAction';
import { EmailTextAction } from './EmailTextAction';
import { PrintOrderAction } from './PrintOrderAction';
import { SaveOrderAction } from './SaveOrderAction';
import UploadAction from './UploadAction';

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
        <UploadAction />
      </Stack>

      <DeleteOrderAction />
      <Divider orientation="vertical" />
    </Stack>
  );
}
