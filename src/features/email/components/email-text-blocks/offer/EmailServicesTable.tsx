import { calculateNumbers, euroValue } from '../../../../../utils/utils';
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
  const { leistungen = [] } = order;

  const { brutto } = calculateNumbers(leistungen);
  const discount = leistungen.filter((l) => l.red === true)?.[0];
  const textAlign = 'left';

  return (
    <>
      <p style={{ textAlign }}>--------------------</p>
      {discount && (
        <>
          <p style={{ textAlign }}>Zwischensumme {euroValue(Number(brutto) - Number(discount.sum))}</p>
          <p style={{ textAlign, color: '#21A870' }}>Rabatt: {euroValue(discount.sum)}</p>
        </>
      )}

      <p style={{ textAlign, fontWeight: 'bolder' }}>Gesamtbetrag inkl. MwSt: {euroValue(brutto)}</p>
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
      {desc.replace(/\n/g, ',')}: {euroValue(price)}
    </Dotted>
  );
}
