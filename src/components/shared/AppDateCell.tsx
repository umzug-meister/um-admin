import { Box, Typography } from '@mui/material';

import React from 'react';

interface Props {
  date: Date;
}
export function AppDateCell({ date }: Readonly<Props>) {
  const dateFormat = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' });

  const timeFormat = new Intl.DateTimeFormat('de-DE', { timeStyle: 'medium' });

  return (
    <Box>
      <Typography display="block" variant="caption">
        {dateFormat.format(date)}
      </Typography>
      <Typography color="secondary" variant="caption">
        {timeFormat.format(date)}
      </Typography>
    </Box>
  );
}
