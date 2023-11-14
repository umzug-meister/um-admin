import { euroValue } from '../../utils/utils';

import { Order } from 'um-types';

interface Props {
  order: Order;
}

export function EmailServicesTable({ order }: Readonly<Props>) {
  const { leistungen = [], timeBased, sum } = order;

  return (
    <table style={{ maxWidth: '600px', borderBottom: '1px solid black' }}>
      <tbody>
        {leistungen
          .filter((l) => l.hidden !== true)
          .map((lst) => (
            <ServicesTableRow key={lst.desc} desc={lst.desc} price={lst.sum} red={lst.red} />
          ))}
        {timeBased?.hours ? (
          <ServicesTableRow price={sum} bold desc={`Gesamtbetrag ${timeBased.hours} Stunden`} />
        ) : (
          <ServicesTableRow price={sum} bold desc="Gesamtbetrag" />
        )}
      </tbody>
    </table>
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
    <tr style={{ color }}>
      {bold ? <th align="left">{desc}</th> : <td align="left">{desc}</td>}
      <th align="right">{euroValue(price)} inkl. MwSt.</th>
    </tr>
  );
}
