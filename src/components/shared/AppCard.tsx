import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';

import React from 'react';

interface Props {
  title: string;
  flexDirection?: 'row';
}

export function AppCard(props: React.PropsWithChildren<Props>) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        sx={{ padding: 1 }}
        title={
          <Typography color="primary" variant="h6">
            {props.title}
          </Typography>
        }
      />
      <CardContent>
        <Box display={'flex'} flexDirection={props.flexDirection || 'column'} gap={1.5}>
          {props.children}
        </Box>
      </CardContent>
    </Card>
  );
}
