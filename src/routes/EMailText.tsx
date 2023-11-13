import { Grid } from '@mui/material';

import { useId } from 'react';

import { CopyOfferButton } from '../components/CopyOfferButton';
import { EMailTextTemplate, EmailServicesTemplate } from '../components/email-text-blocks/EMailTemplates';
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
      <Grid item xs={12} lg={6}>
        <CopyOfferButton elementID={fullText} />
        <EMailTextTemplate elementID={fullText} order={order} />
      </Grid>
      <Grid item xs={12} lg={6}>
        <CopyOfferButton elementID={core} />
        <EmailServicesTemplate elementID={core} order={order} />
      </Grid>
    </AppGridContainer>
  );
}
