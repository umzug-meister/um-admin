import { calculateNumbers, euroValue } from '../../../../../utils/utils';
import { QuillCell, QuillTable } from '../QuillTableComponents';

import { Order } from '@umzug-meister/um-core';

interface Props {
  order: Order;
}

export function EmailServicesTable({ order }: Readonly<Props>) {
  const { leistungen = [] } = order;

  const relevant = leistungen.filter((l) => !l.red).filter((l) => l.hidden !== true);
  if (!relevant.length) return null;

  return (
    <>
      <br />
      <h3>📦 Zusätzliche Kosten</h3>
      <QuillTable>
        {relevant.map((lst) => (
          <ServicesTableRow key={`${lst.desc}-${lst.sum}`} desc={lst.desc} price={lst.sum} />
        ))}
      </QuillTable>
    </>
  );
}

export function Costs({ order }: Readonly<Props>) {
  const { leistungen = [], discount, discountValue } = order;

  const { brutto } = calculateNumbers(leistungen);

  return (
    <QuillTable>
      <tr>
        <QuillCell></QuillCell>
        <QuillCell textAlign="right">-----------</QuillCell>
      </tr>
      {discount && (
        <>
          <tr>
            <QuillCell>Zwischensumme:</QuillCell>
            <QuillCell textAlign="right">{euroValue(Number(brutto) + Number(discountValue))}</QuillCell>
          </tr>
          <tr>
            <QuillCell fontWeight="bold" color="#18A86E">
              Rabatt, {discount} % auf Personalkosten:
            </QuillCell>
            <QuillCell fontWeight="bold" color="#18A86E" textAlign="right">
              {euroValue(discountValue * -1)}
            </QuillCell>
          </tr>
        </>
      )}
      <tr>
        <QuillCell fontWeight="bold">Gesamtbetrag inkl. MwSt:</QuillCell>
        <QuillCell textAlign="right" fontWeight="bold">
          {euroValue(brutto)}
        </QuillCell>
      </tr>
    </QuillTable>
  );
}

interface RowProps {
  desc: string;
  price: string | number;
  red?: boolean;
  bold?: boolean;
}

function ServicesTableRow({ desc, price }: Readonly<RowProps>) {
  return (
    <tr>
      <QuillCell>{desc}</QuillCell>
      <QuillCell textAlign="right">{euroValue(price)}</QuillCell>
    </tr>
  );
}
