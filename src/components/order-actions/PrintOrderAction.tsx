import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { IconButton, Tooltip } from '@mui/material';

import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useAppServices } from '../../hooks/useAppServices';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';
import { generateUrzPdf } from '../../pdf/OrderPdf';
import { AppState } from '../../store';
import { AppOptions } from '../../store/appReducer';

import { AppPacking, AppService } from 'um-types';

export function PrintOrderAction() {
  const currentOrder = useCurrentOrder();
  const services = useAppServices<AppService>('Bohrarbeiten');
  const packings = useAppServices<AppPacking>('Packmaterial');
  const options = useSelector<AppState, AppOptions>((s) => s.app.options);

  const saveOrder = useSaveOrder();

  const printOrder = useCallback(() => {
    saveOrder(currentOrder).then((order) => {
      if (order !== null) {
        generateUrzPdf({ options, order, services: [...services, ...packings] });
      }
    });
  }, [saveOrder, currentOrder, services, packings, options]);

  return (
    <Tooltip title="Als PDF speichern">
      <IconButton onClick={printOrder}>
        <FileDownloadOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
}
