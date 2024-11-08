import { Order } from 'um-types';

interface Props {
  order: Order;
}

export function EmailPersons({ order }: Props) {
  const { workersNumber, transporterNumber } = order;

  const arr = [`${workersNumber} Träger/Ladehelfer`];

  if (transporterNumber) {
    arr.push(`mit ${transporterNumber} x LKW (à 3,5 t mit 20 m³ Ladevermögen)`);
  }

  return (
    <p>
      <strong>{arr.join(' ')}</strong>
    </p>
  );
}
