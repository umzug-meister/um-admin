import { euroValue } from '../../../../../utils/utils';
import { Dotted } from '../Dotted';

import { Order } from 'um-types';

interface Props {
  order: Order;
}

export function EmailServicesTable({ order }: Readonly<Props>) {
  const { leistungen = [] } = order;

  return (
    <>
      <br />
      <h3>📦 Zusätzliche Kosten</h3>
      {leistungen
        .filter((l) => l.hidden !== true)
        .filter((l) => !l.red)
        .map((lst) => (
          <ServicesTableRow key={lst.desc} desc={lst.desc} price={lst.sum} red={lst.red} />
        ))}
    </>
  );
}

export function Costs({ order }: Readonly<Props>) {
  const { leistungen = [], sum } = order;

  const discount = leistungen.filter((l) => l.red === true)?.[0];
  if (!discount) {
    return null;
  }

  return (
    <>
      <p style={{ textAlign: 'right' }}>--------------------</p>
      <p style={{ textAlign: 'right' }}>Zwischensumme {euroValue(Number(sum) - Number(discount.sum))}</p>
      <p style={{ textAlign: 'right', color: '#21A870' }}>Rabatt: {euroValue(discount.sum)}</p>
      <p style={{ textAlign: 'right', fontWeight: 'bolder' }}>Gesamtbetrag inkl. MwSt: {euroValue(sum)}</p>
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
    <Dotted style={{ color, fontWeight: bold ? 'bold' : 'normal', whiteSpace: 'pre-wrap' }}>
      {desc.replace('\n', ',')}: {euroValue(price)}
    </Dotted>
  );
}
