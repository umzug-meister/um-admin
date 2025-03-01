import { calculateNumbers, euroValue } from '../../../../../utils/utils';

import { Order } from '@umzug-meister/um-core';

interface Props {
  order: Order;
}

export function SumTemplate({ order }: Readonly<Props>) {
  const { timeBased, leistungen } = order;

  const { brutto: sum } = calculateNumbers(leistungen);
  const arr = ['Gesamtbetrag:'];
  if (timeBased?.hours) {
    arr[0] = `Gesamtbetrag (${timeBased?.hours} Std.):`;
  }

  arr.push(`${euroValue(sum)} inkl. MwSt.`);
  return <h3>{arr.join(' ')}</h3>;
}
