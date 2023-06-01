import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import { IconButton, Tooltip } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';

export default function UploadAction() {
  const currentOrder = useCurrentOrder();
  const saveOrder = useSaveOrder();
  const n = useNavigate();

  const onUploadRequest = useCallback(() => {
    saveOrder(currentOrder).then((order) => {
      if (order !== null) {
        const id = order.id;

        // const { origin, pathname } = window.location;
        // window.open(`${origin}${pathname}#/drive-upload/${id}`, '_blank');
        n(`/drive-upload/${id}`);
      }
    });
  }, [currentOrder, saveOrder]);

  return (
    <>
      <Tooltip title="Auf Drive hochladen">
        <IconButton onClick={onUploadRequest}>
          <CloudOutlinedIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}
