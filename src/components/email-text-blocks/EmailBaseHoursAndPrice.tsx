import React from 'react';

import { euroValue, getOrtFromAdress } from '../../utils/utils';

import { Order } from 'um-types';

interface Props {
  order: Order;
}

export function BaseHoursAndPrice({ order }: Readonly<Props>) {
  const { timeBased, from, to } = order;
  let value = '';
  if (timeBased?.hours) {
    value += `Mind. Abnahme ${timeBased.hours} Stunden`;
    const startLocation = getOrtFromAdress(from);
    const endLocation = getOrtFromAdress(to);
    if (startLocation && endLocation) {
      value += ` (Anfang in ${getOrtFromAdress(from)}, Ende in ${getOrtFromAdress(to)})`;
    }
    value += ': ';
  }
  value += `${euroValue(timeBased.basis)} inkl. MwSt.`;

  return <p>{value}</p>;
}
