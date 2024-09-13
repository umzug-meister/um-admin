import { Grid2 } from '@mui/material';

import { useId } from 'react';

import { CopyOfferButton } from '../components/CopyOfferButton';
import { EMailTextTemplate, EmailServicesTemplate, RootElement } from '../components/email-text-blocks/EMailTemplates';
import { AppGridContainer } from '../components/shared/AppGridContainer';
import { useLoadOrder } from '../hooks/useLoadOrder';

export default function EMailText() {
  const order = useLoadOrder();

  const fullText = useId();
  const core = useId();

  if (order == null) {
    return null;
  }

  return (
    <AppGridContainer>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <CopyOfferButton elementID={fullText} />
        <RootElement elementID={fullText}>
          <EMailTextTemplate order={order} />
        </RootElement>
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <CopyOfferButton elementID={core} />
        <RootElement elementID={core}>
          <EmailServicesTemplate order={order} />
        </RootElement>
      </Grid2>
    </AppGridContainer>
  );
}
