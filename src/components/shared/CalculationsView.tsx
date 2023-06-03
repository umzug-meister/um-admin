import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import React from 'react';

import { MLeistung } from 'um-types';

interface Props {
  entries?: MLeistung[];
}

const TAX = 0.19;
export default function CalculationsView({ entries = [] }: Props) {
  const sum = entries.reduce((prev, cur) => {
    return prev + Number(cur.sum || 0);
  }, 0);

  const netto = sum / (1 + TAX);
  const mwst = sum - netto;
  const intl = new Intl.NumberFormat('de-de', { style: 'currency', currency: 'EUR' });

  return (
    <Box display={'flex'} flexDirection="column" gap={1}>
      <Typography align="right" variant="h6">
        {`Gesamt: ${intl.format(sum)}`}
      </Typography>
      <Typography align="right">{`MwSt: ${intl.format(mwst)}`}</Typography>
      <Typography align="right">{`Netto: ${intl.format(netto)}`}</Typography>
    </Box>
  );
}
