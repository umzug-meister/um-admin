import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';

import { PropsWithChildren, ReactNode } from 'react';

interface Props {
  title: ReactNode;
}

export function AppCard({ title, children }: PropsWithChildren<Props>) {
  return (
    <Card elevation={0} sx={{ height: '100%' }}>
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
