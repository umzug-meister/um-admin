import { Card, CardContent } from '@mui/material';

import { useCurrentOrder } from '../hooks/useCurrentOrder';
import { euroValue, numberValue } from '../utils/utils';

import styled from '@emotion/styled';

const Table = styled.table({
  width: '100%',
  '& td': {
    fontFamily: 'monospace',
    textAlign: 'right',
    paddingLeft: '5px',
  },
  '& th': {
    padding: '10px 0',
    textAlign: 'left',
  },
});

export function OrderCalculator() {
  const order = useCurrentOrder();
  return (
    <Card elevation={4}>
      <CardContent>
        <Table>
          <tbody>
            <tr>
              <th>{`Basis (${numberValue(order?.timeBased?.hours) || '*'} Stunden)`}</th>
              <td>{euroValue(order?.timeBased?.basis)}</td>
            </tr>

            <tr>
              <th>{`Rabatt (${numberValue(order?.discount) || '0'} %)`}</th>
              <td>{euroValue(order?.discountValue)}</td>
            </tr>

            <tr>
              <th>{`Fahrtkosten: ${numberValue(order?.distance)} km`}</th>
              <td>{euroValue(order?.rideCosts)}</td>
            </tr>

            <tr>
              <th>Halteverbotszonenen</th>
              <td>{euroValue(order?.prices?.halteverbotszonen)}</td>
            </tr>

            <tr>
              <th>Verpackung</th>
              <td>{euroValue(order?.prices?.verpackung)}</td>
            </tr>

            <tr>
              <th>Leistungen</th>
              <td>{euroValue(order?.prices?.services)}</td>
            </tr>

            <tr>
              <th>Weiteres</th>
              <td>{euroValue(order?.prices?.other)}</td>
            </tr>
            <tr>
              <th>Summe</th>
              <td>{euroValue(order?.sum)}</td>
            </tr>
          </tbody>
        </Table>
      </CardContent>
    </Card>
  );
}
