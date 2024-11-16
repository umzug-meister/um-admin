import { Box, Grid2 } from '@mui/material';

import { PropsWithChildren, useId } from 'react';

import { CopyOfferButton } from '../../../components/CopyOfferButton';
import { AppGridContainer } from '../../../components/shared/AppGridContainer';
import { useLoadOrder } from '../../../hooks/useLoadOrder';
import { EmailOfferOptions } from '../components/email-text-blocks/EmailOfferOptions';
import { EMailOfferTemplate } from '../components/email-text-blocks/EmailOfferTemplates';

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
          <EMailOfferTemplate order={order} />
        </RootElement>
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <CopyOfferButton elementID={core} />
        <RootElement elementID={core}>
          <EmailOfferOptions order={order} />
        </RootElement>
      </Grid2>
    </AppGridContainer>
  );
}

function RootElement({ elementID, children }: PropsWithChildren<{ elementID: string }>) {
  return (
    <Box
      id={elementID}
      sx={{
        fontSize: '14px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        maxWidth: '900px',
      }}
    >
      {children}
    </Box>
  );
}
