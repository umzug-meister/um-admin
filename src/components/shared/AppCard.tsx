import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';

import React from 'react';

interface Props {
  title: React.ReactNode;
}

export function AppCard({ title, children }: React.PropsWithChildren<Props>) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        sx={{ padding: 1 }}
        title={
          typeof title === 'string' ? (
            <Typography color="primary" variant="h6">
              {title}
            </Typography>
          ) : (
            title
          )
        }
      />
      <CardContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
