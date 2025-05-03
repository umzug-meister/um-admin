import { Box, Typography } from '@mui/material';

import { isValid } from 'date-fns';

interface Props {
  date: Date;
  showTime?: boolean;
}
export function AppDateCell({ date, showTime = true }: Readonly<Props>) {
  if (!isValid(date)) {
    return null;
  }
  const dateFormat = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' });

  const timeFormat = new Intl.DateTimeFormat('de-DE', { timeStyle: 'short' });

  return (
    <Box display="flex" flexDirection="column" justifyContent={'center'} sx={{ height: '100%' }}>
      <Typography display="block" variant="subtitle2">
        {dateFormat.format(date)}
      </Typography>
      {showTime && <Typography variant="caption">{timeFormat.format(date)}</Typography>}
    </Box>
  );
}
