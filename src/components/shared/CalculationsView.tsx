import { Typography } from '@mui/material';
import { Box } from '@mui/system';

import { calculateNumbers, euroValue } from '../../utils/utils';

import { MLeistung } from 'um-types';

interface Props {
  entries?: MLeistung[];
  align?: 'right' | 'left';
}

export default function CalculationsView({ entries = [], align = 'right' }: Props) {
  const { brutto, netto, tax } = calculateNumbers(entries);

  return (
    <Box display={'flex'} flexDirection="column" gap={1}>
      <Typography align={align} variant="h6">
        {`Gesamt: ${euroValue(brutto)}`}
      </Typography>
      <Typography align={align}>{`MwSt: ${euroValue(tax)}`}</Typography>
      <Typography align={align}>{`Netto: ${euroValue(netto)}`}</Typography>
    </Box>
  );
}
