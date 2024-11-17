import { Card, CardContent, Grid2 } from '@mui/material';

import { useCurrentOrder } from '../hooks/useCurrentOrder';
import CalculationsView from './shared/CalculationsView';

export function OrderCalculator() {
  const order = useCurrentOrder();

  return (
    <Grid2 size={12}>
      <Card elevation={0}>
        <CardContent>
          <CalculationsView align="right" entries={order?.leistungen} />
        </CardContent>
      </Card>
    </Grid2>
  );
}
