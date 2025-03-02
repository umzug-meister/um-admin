import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';

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
        <Stack spacing={1.5}>{children}</Stack>
      </CardContent>
    </Card>
  );
}
