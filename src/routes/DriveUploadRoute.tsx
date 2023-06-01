import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { useSelector } from 'react-redux';
import { AppPacking, AppService } from 'um-types';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import { useAppServices } from '../hooks/useAppServices';
import { generateUrzPdf } from '../pdf/OrderPdf';
import { AppState } from '../store';
import { AppOptions } from '../store/appReducer';
import { useLoadOrder } from './Edit';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import OrderPdfView from '../components/OrderPdfView';
import { RootBox } from '../components/shared/RootBox';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

export default function DriveUploadRoute() {
  const [base64, setBase64] = useState<null | string>(null);

  const [services] = useState(useAppServices<AppService>('Bohrarbeiten'));
  const [packings] = useState(useAppServices<AppPacking>('Packmaterial'));

  const order = useLoadOrder();
  const options = useSelector<AppState, AppOptions>((s) => s.app.options);

  useEffect(() => {
    if (order) {
      const orderAsBase64 = generateUrzPdf({
        options,
        order,
        services: [...services, ...packings],
        base64: true,
      });
      if (orderAsBase64) {
        setBase64(orderAsBase64);
      }
    }
  }, [order, options, services, packings]);

  return (
    <RootBox>
      <AppGridContainer>
        <Grid item xs={6}>
          <OrderPdfView base64={base64} />
        </Grid>
        <Grid item xs={6}></Grid>
      </AppGridContainer>
    </RootBox>
  );
}
