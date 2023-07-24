import { addCustomer, addKonto, addPostAddr, addPrice, addTable, addText, move } from './InvoicePdf';
import PdfBuilder from './PdfBuilder';
import { creditFileName } from './filename';
import { addDate, addHeader } from './shared';

import { Gutschrift, Rechnung } from 'um-types';

interface Payload {
  gutschrift: Gutschrift;
  rechnung: Rechnung;
}

export const generateGutschrift = ({ gutschrift, rechnung }: Payload) => {
  const factory = new PdfBuilder(creditFileName(rechnung, gutschrift), {
    left: 20,
    right: 12,
    top: 8,
    bottom: 3,
  });

  factory.addSpace(5);
  addHeader(factory);
  addPostAddr(factory);
  addDate(factory, gutschrift.date);

  addCustomer(factory, rechnung);
  addGNumber(factory, gutschrift.gNumber, rechnung.rNumber);

  addTable(factory, gutschrift, true);

  addPrice(factory, gutschrift, true);

  gutschrift.text && addText(factory, gutschrift.text);

  move(factory);

  addKonto(factory);
  factory.save();
};

const addGNumber = (factory: PdfBuilder, gNumber: string | number, rNumber: string | number) => {
  factory.addSpace(35);
  factory.setBold();
  factory.addText(`Gutschrift Nr: ${gNumber}  /  Rechnung Nr: ${rNumber}`, 12, 12, 'center');
};
