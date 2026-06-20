import {
  anrede,
  calculateNumbers,
  createDueDate,
  euroValue,
  generateText,
  getColorBySrc,
  getCustomerFullname,
  getCustomerPLZ,
  getCustomerStreet,
  getNextDueDate,
  getOrtFromAdress,
  getParkingsSlotsAmount,
  getParseableDate,
  getPrintableDate,
  isLocalMovement,
  numberValue,
} from './utils';

import { Address, Customer, Order, Rechnung } from '@umzug-meister/um-core';
import { describe, expect, test, vi } from 'vitest';

describe('euroValue', () => {
  test('undefined', () => {
    expect(euroValue(undefined)).toBe('');
  });

  test('empty string', () => {
    expect(euroValue('')).toBe('');
  });

  test('integer', () => {
    expect(euroValue('12')).toBe('12,00\xa0€');
    expect(euroValue(1295)).toBe('1.295,00\xa0€');
  });

  test('float', () => {
    expect(euroValue('12,24')).toBe('12,24\xa0€');
    expect(euroValue(1295.99)).toBe('1.295,99\xa0€');
  });
});

describe('getPrintableDate', () => {
  test('undefined', () => {
    expect(getParseableDate(undefined)).toBe('');
  });

  test('print-format', () => {
    const pd = getPrintableDate('10.12.2022');
    expect(pd).equal('10.12.2022');
  });
  test('parseable-date', () => {
    const pd = getPrintableDate('2022-12-10');
    expect(pd).equal('10.12.2022');
  });

  test('parseable-date, long', () => {
    const pd = getPrintableDate('2022-12-10', true);
    expect(pd).equal('Samstag, 10. Dezember 2022');
  });
});

describe('getParseableDate', () => {
  test('undefined', () => {
    expect(getParseableDate(undefined)).toBe('');
  });
  test('print-format', () => {
    const pd = getParseableDate('10.12.2022');

    expect(pd).equal('2022-12-10');
  });
  test('already parseable', () => {
    expect(getParseableDate('2022-12-10')).toBe('2022-12-10');
  });
});

describe('getCustomerFullname', () => {
  test('null', () => {
    expect(getCustomerFullname(null)).toBe('');
  });

  test('customer full', () => {
    expect(
      getCustomerFullname({
        customer: { firstName: 'Max', lastName: 'Meier', salutation: 'Herr' },
      } as Order),
    ).toBe('Herr Max Meier');
  });
});

describe('getCustomerStreet', () => {
  test('empty', () => {
    expect(getCustomerStreet(null)).toBe('');
    expect(getCustomerStreet({} as Order)).toBe('');
    expect(getCustomerStreet({ to: {} } as Order)).toBe('');
  });

  test('no comma', () => {
    expect(getCustomerStreet({ to: { address: 'Street 2' } } as Order)).toBe('Street 2');
  });

  test('has street', () => {
    expect(
      getCustomerStreet({
        to: { address: 'Street 2, 80804 Muenchen' },
      } as Order),
    ).toBe('Street 2');
  });

  test('has street, with country', () => {
    expect(
      getCustomerStreet({
        to: { address: 'Street 2, 80804 Muenchen, Deutschland' },
      } as Order),
    ).toBe('Street 2');
  });
});

describe('getCustomerFullname', () => {
  test('customer with all fields', () => {
    expect(
      getCustomerFullname({
        customer: {
          salutation: 'Frau',
          firstName: 'Anna',
          lastName: 'Schmidt',
          company: 'ABC GmbH',
        },
      } as Order),
    ).toBe('Frau Anna Schmidt (ABC GmbH)');
  });

  test('customer without salutation', () => {
    expect(
      getCustomerFullname({
        customer: { firstName: 'John', lastName: 'Doe', company: 'XYZ Inc.' },
      } as Order),
    ).toBe('John Doe (XYZ Inc.)');
  });

  test('customer without company', () => {
    expect(
      getCustomerFullname({
        customer: { salutation: 'Mr.', firstName: 'James', lastName: 'Bond' },
      } as Order),
    ).toBe('Mr. James Bond');
  });

  test('customer with only first name', () => {
    expect(getCustomerFullname({ customer: { firstName: 'Madonna' } } as Order)).toBe('Madonna');
  });

  test('customer with only last name', () => {
    expect(getCustomerFullname({ customer: { lastName: 'Cher' } } as Order)).toBe('Cher');
  });

  test('customer with only company', () => {
    expect(getCustomerFullname({ customer: { company: 'Acme Corp' } } as Order)).toBe('(Acme Corp)');
  });

  describe('isLocalMovement', () => {
    test('all addresses are in München', () => {
      const addresses = [{ address: 'Street 1, München' }, { address: 'Street 2, München' }] as Address[];
      expect(isLocalMovement(addresses)).toBe(true);
    });

    test('some addresses are not in München', () => {
      const addresses = [{ address: 'Street 1, München' }, { address: 'Street 2, Berlin' }] as Address[];
      expect(isLocalMovement(addresses)).toBe(false);
    });

    test('no addresses provided', () => {
      const addresses: Array<Address | undefined> = [];
      expect(isLocalMovement(addresses)).toBe(true);
    });

    test('undefined addresses in the array', () => {
      const addresses = [{ address: 'Street 1, München' }, undefined, { address: 'Street 2, München' }] as Array<
        Address | undefined
      >;
      expect(isLocalMovement(addresses)).toBe(true);
    });

    test('all addresses are undefined', () => {
      const addresses = [undefined, undefined] as Array<Address | undefined>;
      expect(isLocalMovement(addresses)).toBe(true);
    });

    test('address without "München"', () => {
      const addresses = [{ address: 'Street 1, Berlin' }, { address: 'Street 2, Hamburg' }] as Address[];
      expect(isLocalMovement(addresses)).toBe(false);
    });
  });

  describe('getParkingsSlotsAmount', () => {
    test('no addresses provided', () => {
      const addresses: Array<Address | undefined> = [];
      expect(getParkingsSlotsAmount(addresses)).toBe(0);
    });

    test('addresses with parking slots', () => {
      const addresses = [{ parkingSlot: true }, { parkingSlot: true }, { parkingSlot: true }] as Address[];
      expect(getParkingsSlotsAmount(addresses)).toBe(3);
    });

    test('addresses with some undefined parking slots', () => {
      const addresses = [{ parkingSlot: true }, undefined, { parkingSlot: false }] as Array<Address | undefined>;
      expect(getParkingsSlotsAmount(addresses)).toBe(1);
    });

    test('all addresses have undefined parking slots', () => {
      const addresses = [undefined, undefined] as Array<Address | undefined>;
      expect(getParkingsSlotsAmount(addresses)).toBe(0);
    });

    test('undefined addresses in the array', () => {
      const addresses = [{ parkingSlot: true }, undefined, { parkingSlot: true }] as Array<Address | undefined>;
      expect(getParkingsSlotsAmount(addresses)).toBe(2);
    });

    test('mixed valid and undefined addresses', () => {
      const addresses = [undefined, { parkingSlot: true }, undefined, { parkingSlot: true }] as Array<
        Address | undefined
      >;
      expect(getParkingsSlotsAmount(addresses)).toBe(2);
    });
  });
});

describe('calculateNumbers', () => {
  test('empty entries', () => {
    expect(calculateNumbers([])).toEqual({ brutto: 0, netto: 0, tax: 0 });
  });

  test('with entries', () => {
    const entries = [{ sum: '100' }, { sum: '200' }] as any;
    const result = calculateNumbers(entries);
    expect(result.brutto).toBe(300);
    expect(result.netto).toBeCloseTo(252.1, 1);
    expect(result.tax).toBeCloseTo(47.9, 1);
  });
});

describe('createDueDate', () => {
  test('creates a due date', () => {
    const result = createDueDate({ index: 0, text: 'Erste Mahnung', date: '2024-01-15', sum: 500 });
    expect(result).toEqual({ index: 0, text: 'Erste Mahnung', date: '2024-01-15', sum: 500, costs: 10 });
  });
});

describe('getNextDueDate', () => {
  test('adds 10 days', () => {
    const date = new Date('2024-01-01');
    const result = getNextDueDate({ date });
    expect(result).toBe('11.01.2024');
  });
});

describe('getCustomerPLZ', () => {
  test('empty order', () => {
    expect(getCustomerPLZ(null)).toBe('');
    expect(getCustomerPLZ({} as Order)).toBe('');
  });

  test('returns PLZ from address', () => {
    expect(getCustomerPLZ({ to: { address: 'Street 2, 80804 Muenchen' } } as Order)).toBe('80804 Muenchen');
  });
});

describe('numberValue', () => {
  test('undefined/empty', () => {
    expect(numberValue(undefined)).toBe('');
    expect(numberValue('')).toBe('');
  });

  test('formats number', () => {
    expect(numberValue('1200,50')).toBe('1.200,5');
    expect(numberValue(1295)).toBe('1.295');
  });
});

describe('anrede', () => {
  test('company without lastName', () => {
    expect(anrede({ company: 'Firma GmbH' } as Customer)).toBe('Sehr geehrte Damen und Herren,');
  });

  test('Frau', () => {
    expect(anrede({ salutation: 'Frau', lastName: 'Müller' } as Customer)).toBe('Sehr geehrte Frau Müller,');
  });

  test('Herr', () => {
    expect(anrede({ salutation: 'Herr', lastName: 'Meier' } as Customer)).toBe('Sehr geehrter Herr Meier,');
  });

  test('fallback', () => {
    expect(anrede({ firstName: 'Max', lastName: 'Mustermann' } as Customer)).toBe('Hallo Max Mustermann,');
  });
});

describe('generateText', () => {
  const baseRechnung = {
    dueDates: [
      { index: 0, date: '01.01.2024' },
      { index: 1, date: '15.01.2024' },
      { index: 2, date: '01.02.2024' },
    ],
    customerName: 'Max Mustermann',
  } as unknown as Rechnung;

  test('index 1 (first reminder)', () => {
    const text = generateText({ rechnung: baseRechnung, index: 1, sum: 500, nextDueDate: '11.02.2024' });
    expect(text).toContain('Sehr geehrter Max Mustermann');
    expect(text).toContain('01.01.2024');
    expect(text).toContain('11.02.2024');
  });

  test('index 2 (second reminder)', () => {
    const text = generateText({ rechnung: baseRechnung, index: 2, sum: 500, nextDueDate: '25.02.2024' });
    expect(text).toContain('15.01.2024');
    expect(text).toContain('25.02.2024');
  });

  test('index 3 (third reminder)', () => {
    const text = generateText({ rechnung: baseRechnung, index: 3, sum: 500, nextDueDate: '10.03.2024' });
    expect(text).toContain('15.01.2024');
    expect(text).toContain('01.02.2024');
    expect(text).toContain('10.03.2024');
  });

  test('with firma', () => {
    const rechnung = { ...baseRechnung, firma: ['Firma GmbH'], customerName: '' } as unknown as Rechnung;
    const text = generateText({ rechnung, index: 1, sum: 500, nextDueDate: '11.02.2024' });
    expect(text).toContain('Sehr geehrte Damen und Herren');
  });
});

describe('getOrtFromAdress', () => {
  test('undefined address', () => {
    expect(getOrtFromAdress(undefined as any)).toBe(' ');
  });

  test('extracts city', () => {
    expect(getOrtFromAdress({ address: 'Street 2, 80804 München' } as Address)).toBe('80804 München');
  });

  test('no comma in address', () => {
    expect(getOrtFromAdress({ address: 'Nur ein Ort' } as Address)).toBe('Nur ein Ort');
  });
});

describe('getColorBySrc', () => {
  test('returns correct color for each source', () => {
    expect(getColorBySrc('check24' as any)).toBe('#0271c2');
    expect(getColorBySrc('obi' as any)).toBe('#ff7e21');
    expect(getColorBySrc('myhammer' as any)).toBe('#5e257a');
    expect(getColorBySrc('express' as any)).toBe('#addfcb');
  });

  test('returns undefined for unknown source', () => {
    expect(getColorBySrc('unknown' as any)).toBeUndefined();
  });
});
