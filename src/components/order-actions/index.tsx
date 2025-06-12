import { Divider, Stack } from '@mui/material';

import { useSelector } from 'react-redux';

import { EmailActions } from '../../features/email/components/actions/EmailActions';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { AppState } from '../../store';
import CopyOrderAction from './CopyOrderAction';
import { DeleteOrderAction } from './DeleteOrderAction';
import { PrintOrderAction } from './PrintOrderAction';
import { SaveOrderAction } from './SaveOrderAction';

export function OrderEditActions() {
  const order = useCurrentOrder();

  const unsavedChanges = useSelector<AppState, boolean>(({ app }) => app.unsavedChanges);
  if (order === null) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1} divider={<Divider orientation="vertical" flexItem />}>
      <SaveOrderAction />
      <CopyOrderAction disabled={unsavedChanges} />
      <PrintOrderAction disabled={unsavedChanges} />
      <EmailActions disabled={unsavedChanges} />
      <DeleteOrderAction />
    </Stack>
  );
}
