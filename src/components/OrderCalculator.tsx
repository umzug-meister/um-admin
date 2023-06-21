import { Card, CardContent } from '@mui/material';

import { useCurrentOrder } from '../hooks/useCurrentOrder';
import CalculationsView from './shared/CalculationsView';

export function OrderCalculator() {
  const order = useCurrentOrder();

  return (
    <Card
      elevation={0}
      sx={{
        color: 'white',
        background: 'linear-gradient(to right bottom, #007FFF, #0059B2 120%)',
      }}
    >
      <CardContent>
        <CalculationsView align="left" entries={Number(order?.sum || 0)} />
      </CardContent>
    </Card>
  );
}
