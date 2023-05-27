import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { IconButton, Tooltip } from '@mui/material';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAppServices } from '../hooks/useAppServices';
import { useCurrentOrder } from '../hooks/useCurrentOrder';
import { generateUrzPdf } from '../pdf/OrderPdf';
import { AppDispatch, AppState } from '../store';
import { AppOptions, createUpdateOrder } from '../store/appReducer';

import { AppPacking, AppService } from 'um-types';

export default function PrintOrder() {
  const dispatch = useDispatch<AppDispatch>();

  const order = useCurrentOrder();
  const services = useAppServices<AppService>('Bohrarbeiten');
  const packings = useAppServices<AppPacking>('Packmaterial');
  const options = useSelector<AppState, AppOptions>((s) => s.app.options);

  const printOrder = useCallback(() => {
    if (order) {
      const callback = () => generateUrzPdf({ options, order, services: [...services, ...packings] });
      dispatch(createUpdateOrder({ id: order?.id, callback }));
    }
  }, [dispatch, order, services, packings, options]);

  return (
    <Tooltip title="Als PDF speichern">
      <IconButton onClick={printOrder}>
        <FileDownloadOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
}
