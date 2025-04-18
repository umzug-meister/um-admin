import { Card, CardContent, Grid } from '@mui/material';

import { useCurrentOrder } from '../hooks/useCurrentOrder';
import CalculationsView from './shared/CalculationsView';

export function OrderCalculator() {
  const order = useCurrentOrder();

  return (
    <Grid size={12}>
      <Card elevation={0}>
        <CardContent>
          <CalculationsView align="right" entries={order?.leistungen} />
        </CardContent>
      </Card>
    </Grid>
  );
}
