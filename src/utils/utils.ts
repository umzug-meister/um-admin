import { Customer, DueDate, MLeistung, Order } from 'um-types';

const MWST = 1.19;

const WAITING_DAYS = 10;

export const calculateNumbers = (entries: MLeistung[]) => {
  const brutto = entries.reduce((acc, elem) => {
    return acc + Number(elem.sum || 0);
  }, 0);

  const netto = brutto / MWST;

  const tax = brutto - netto;

  return {
    brutto,
    netto,
    tax,
  };
};

export const createDueDate = (index: number, sum = 0): DueDate => {
  return {
    index,
    costs: 0,
    date: new Date().addDays(WAITING_DAYS).toLocaleDateString('ru'),
    sum: sum,
  };
};

export function getPrintableDate(date: string | undefined, long = false) {
  if (!date || date === '') {
    return '';
  }
  const regex = /[0-9]{2}.[0-9]{2}.[0-9]{4}/gm;

  const isPrintable = regex.test(date);

  if (long) {
    return new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'full',
    }).format(new Date(getParseableDate(date)));
  }
  return isPrintable ? date : new Date(date).toLocaleDateString('ru');
}

export function getParseableDate(date: any) {
  if (typeof date !== 'string') {
    return '';
  }

  const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/gm;

  const parseable = regex.test(date);
  if (parseable) {
    return date;
  }

  return date
    .split('.')
    .map((s) => s.padStart(2, '0'))
    .reverse()
    .join('-');
}

export function getCustomerFullname(order?: Order | null) {
  if (order?.customer) {
    return `${order?.customer?.salutation || ''} ${order.customer?.firstName || ''} ${
      order.customer?.lastName || ''
    }`.trim();
  }
  return '';
}

export function getCustomerStreet(order?: Order | null) {
  if (order?.to) {
    return order.to.address?.split(', ')[0] || '';
  }
  return '';
}

export function getCustomerPLZ(order?: Order | null) {
  if (order?.to) {
    return order.to.address?.split(', ')[1];
  }
  return '';
}

export function euroValue(value: string | number | undefined) {
  if (typeof value == 'undefined' || value === '') {
    return '';
  }

  let toFormat = value;
  if (typeof value == 'string') {
    toFormat = value.replace(',', '.');
  }

  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(toFormat));
}

export function numberValue(value: string | number | undefined) {
  if (typeof value == 'undefined' || value === '') {
    return '';
  }
  let toFormat = value;
  if (typeof value === 'string') {
    toFormat = value.replace(',', '.');
  }

  return new Intl.NumberFormat('de-DE').format(Number(toFormat));
}

export const anrede = (customer: Customer) => {
  const { salutation, lastName, company } = customer;

  if (company && !lastName) {
    return 'Sehr geehrte Damen und Herren,';
  }

  return salutation === 'Frau' ? `Sehr geehrte Frau ${lastName},` : `Sehr geehrter Herr ${lastName},`;
};

export const clearCountry = (str: string) => {
  // prettier-ignore
  return str
    .replace(', Deutschland', '')
    .replace(', Германия', '')
    .replace(', Germany', '');
};
