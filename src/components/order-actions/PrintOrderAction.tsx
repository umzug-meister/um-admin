import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { IconButton, Tooltip } from '@mui/material';

import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { AppOptions } from '../../app-types';
import { useAppServices } from '../../hooks/useAppServices';
import { useCurrentOrder } from '../../hooks/useCurrentOrder';
import { useSaveOrder } from '../../hooks/useSaveOrder';
import { generateUrzPdf } from '../../pdf/OrderPdf';
import { AppState } from '../../store';

import { AppPacking, AppService } from 'um-types';

export function PrintOrderAction() {
  const order = useCurrentOrder();
  const services = useAppServices<AppService>('Bohrarbeiten');
  const packings = useAppServices<AppPacking>('Packmaterial');
  const options = useSelector<AppState, AppOptions>((s) => s.app.options);

  const saveOrder = useSaveOrder();

  const checkOrderHvz = useCallback(() => {
    if (!order) {
      return;
    }

    const { from, to, leistungen = [] } = order;

    if (from.parkingSlot || to.parkingSlot) {
      if (leistungen.some((lst) => lst.desc.toUpperCase().includes('HALTEVERBOT'))) {
        return;
      } else {
        alert(`Halteverbotzone(n) wurde(n) ausgewählt!\nBitte entweder die HVZ entfernen oder als Kondition aufnehmen.
        `);
      }
    }
  }, [order]);

  const printOrder = useCallback(() => {
    checkOrderHvz();
    saveOrder(order).then((order) => {
      if (order !== null) {
        generateUrzPdf({
          options,
          order,
          services: [...services, ...packings],
        });
      }
    });
  }, [saveOrder, order, services, packings, options, checkOrderHvz]);

  return (
    <Tooltip title="Als PDF speichern">
      <IconButton onClick={printOrder} color="inherit">
        <FileDownloadOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
}
