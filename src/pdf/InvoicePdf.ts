import { calculateNumbers, euroValue, getPrintableDate } from '../utils/utils';
import PdfBuilder from './PdfBuilder';
import { invoiceFileName } from './filename';
import { addHeader } from './shared';

import { Gutschrift, Rechnung } from 'um-types';

export const generateRechnung = (rechnung: Rechnung) => {
  const factory = new PdfBuilder(invoiceFileName(rechnung), {
    left: 20,
    right: 12,
    top: 8,
    bottom: 3,
  });

  factory.addSpace(5);

  addHeader(factory);
  addPostAddr(factory);
  addInvoiceInformation(factory, { ...rechnung });
  addCustomer(factory, rechnung);
  addRNumber(factory, rechnung);
  addTable(factory, rechnung);
  addPrice(factory, rechnung);
  addText(factory, rechnung.text);
  move(factory);
  addVermerk(factory);
  addKonto(factory);

  factory.save();
};

export function addInvoiceInformation(factory: PdfBuilder, params: { date: string; orderId: string | undefined }) {
  const { date, orderId } = params;
  factory.addSpace(5);

  const info = [];
  info.push(`Rechnungsdatum: ${getPrintableDate(date)}`);
  if (orderId) info.push(`Auftragsnummer: ${orderId}`);

  factory.addLeftRight([], info);
}
export function addPostAddr(factory: PdfBuilder) {
  factory.resetText();
  factory.addSpace(15);
  factory.addText(`Alexander Berent, Am Münchfeld 31, 80999 München`, 8);
}

export function addCustomer(factory: PdfBuilder, { customerName, customerPlz, customerStreet, firma }: Rechnung) {
  factory.addSpace(5);
  const col = [];
  if (firma) col.push(firma);
  if (customerName) col.push(customerName);

  if (customerStreet) col.push(customerStreet);
  if (customerPlz) col.push(customerPlz);
  factory.addLeftRight(col, ['', '', '', '']);
}

function addRNumber(factory: PdfBuilder, { rNumber }: Rechnung) {
  factory.addSpace(35);
  factory.setBold();
  factory.addText(`Rechnung Nr: ${rNumber}`, 12, 12, 'center');
}

export function addTable(factory: PdfBuilder, { entries }: Rechnung | Gutschrift, negative = false) {
  const head = [['Bezeichnung', 'Menge', 'Einzelpreis', 'Betrag']];

  const multiplikator = negative ? -1 : 1;

  const body = entries.map((e) => {
    return [
      e.desc,
      e.colli,
      e.price ? euroValue(Number(e.price) * multiplikator) : '',
      e.sum ? euroValue(Number(e.sum) * multiplikator) : '',
    ];
  });
  factory.addTable({
    head,
    body,
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
    },
    headStyles: { halign: 'center' },
    margin: 20,
  });
}

export function addPrice(factory: PdfBuilder, { entries }: Rechnung | Gutschrift, negative = false) {
  factory.addSpace(10);
  const { tax, brutto, netto } = calculateNumbers(entries);

  const prefix = negative ? '- ' : '';

  factory.addLeftRight(
    [],
    [
      `Nettobetrag:   ${prefix}${euroValue(netto)}`,
      `19% MwSt:     ${prefix}${euroValue(tax)}`,
      `Gesamtbetrag:   ${prefix}${euroValue(brutto)}`,
    ],
  );
}

export function addText(factory: PdfBuilder, text: string) {
  factory.addSpace(10);
  factory.resetText();
  factory.addTable({
    head: null,
    body: [[text]],
    columnStyles: {
      0: { lineColor: [255, 255, 255] },
    },

    margin: 20,
  });
}

export function move(factory: PdfBuilder, bestYpos = 250) {
  const currentY = factory.getY();
  if (currentY < bestYpos) {
    factory.addSpace(bestYpos - currentY);
  }
}

export function addVermerk(factory: PdfBuilder) {
  factory.addText('Die Rechnung wurde maschinell erstellt und ist ohne Unterschrift gültig.', 8);
}

export function addKonto(factory: PdfBuilder) {
  factory.addLine();
  factory.add2Cols(
    ['Bankverbindung:'],
    ['Alexander Berent, Stadtsparkasse München', 'IBAN: DE41 7015 0000 1005 7863 20', 'BIC: SSKMDEMMXXX'],
    8,
    7,
    1,
  );
}
