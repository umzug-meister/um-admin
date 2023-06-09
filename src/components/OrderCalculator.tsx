import { Card, CardContent, useTheme } from '@mui/material';

import { useCurrentOrder } from '../hooks/useCurrentOrder';
import CalculationsView from './shared/CalculationsView';

export function OrderCalculator() {
  const theme = useTheme();
  const order = useCurrentOrder();

  return (
    <Card
      elevation={0}
      sx={{
        color: 'white',
        background: theme.palette.primary.main,
      }}
    >
      <CardContent>
        <CalculationsView align="left" entries={Number(order?.sum || 0)} />
      </CardContent>
    </Card>
  );
}
