import { Box, Card, CardContent, CardHeader } from '@mui/material';

import React from 'react';

interface Props {
  title: string;
  flexDirection?: 'row';
}

export function AppCard(props: React.PropsWithChildren<Props>) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader title={props.title} />
      <CardContent>
        <Box display={'flex'} flexDirection={props.flexDirection || 'column'} gap="15px">
          {props.children}
        </Box>
      </CardContent>
    </Card>
  );
}
