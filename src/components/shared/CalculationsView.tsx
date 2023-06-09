import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import { MLeistung } from 'um-types';

interface Props {
  entries?: MLeistung[] | number;
  align?: 'right' | 'left';
}

const TAX = 0.19;
export default function CalculationsView({ entries = [], align = 'right' }: Props) {
  const sum =
    (Array.isArray(entries)
      ? entries.reduce((prev, cur) => {
          return prev + Number(cur.sum || 0);
        }, 0)
      : entries) || 0;

  const netto = sum / (1 + TAX);
  const mwst = sum - netto;
  const intl = new Intl.NumberFormat('de-de', { style: 'currency', currency: 'EUR' });

  return (
    <Box display={'flex'} flexDirection="column" gap={1}>
      <Typography align={align} variant="h6">
        {`Gesamt: ${intl.format(sum)}`}
      </Typography>
      <Typography align={align}>{`MwSt: ${intl.format(mwst)}`}</Typography>
      <Typography align={align}>{`Netto: ${intl.format(netto)}`}</Typography>
    </Box>
  );
}
