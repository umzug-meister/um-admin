import { euroValue } from '../../utils/utils';

import { Order } from 'um-types';

interface Props {
  order: Order;
}

export function EmailServicesTable({ order }: Readonly<Props>) {
  const { leistungen = [] } = order;

  return (
    <>
      <h3>Zusätzliche Kosten</h3>
      <ul>
        {leistungen
          .filter((l) => l.hidden !== true)
          .map((lst) => (
            <ServicesTableRow key={lst.desc} desc={lst.desc} price={lst.sum} red={lst.red} />
          ))}
      </ul>
    </>
  );
}

interface RowProps {
  desc: string;
  price: string | number;
  red?: boolean;
  bold?: boolean;
}

function ServicesTableRow({ desc, price, red, bold }: Readonly<RowProps>) {
  const color = red ? 'red' : 'black';

  return (
    <li style={{ color, fontWeight: bold ? 'bold' : 'normal' }}>
      {desc}: {euroValue(price)} inkl. MwSt.
    </li>
  );
}
