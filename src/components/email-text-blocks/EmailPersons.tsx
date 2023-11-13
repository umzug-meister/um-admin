import React from 'react';

import { Order } from 'um-types';

interface Props {
  order: Order;
}

export function EmailPersons({ order }: Props) {
  const { workersNumber, transporterNumber, t75 } = order;

  let value = `${workersNumber} Träger/Ladehelfer`;

  if (transporterNumber || t75) {
    value += ` mit `;
  }
  if (transporterNumber) {
    value += `${transporterNumber} x LKW (à 3,5 t mit 20 m³ Ladevermögen) `;
  }
  if (t75) {
    value += `${t75} x LKW (à 7,5 t mit 37,5 m³ Ladevermögen) `;
  }
  return (
    <p>
      <b>{value}</b>
    </p>
  );
}
