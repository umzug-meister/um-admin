import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined';
import { IconButton, Tooltip } from '@mui/material';
import { useCallback } from 'react';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';

export default function UploadAction() {
  const currentOrder = useCurrentOrder();
  const saveOrder = useSaveOrder();

  const onUploadRequest = useCallback(() => {
    saveOrder(currentOrder).then((order) => {
      if (order !== null) {
        const id = order.id;

        const { origin, pathname } = window.location;
        window.open(`${origin}${pathname}#/drive-upload/${id}`, '_blank');
      }
    });
  }, [currentOrder, saveOrder]);

  return (
    <>
      <Tooltip title="Bei Drive speichern">
        <IconButton onClick={onUploadRequest}>
          <AddToDriveOutlinedIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}
