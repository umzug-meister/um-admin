import { describe, expect, test, vi } from 'vitest';
import { orderFileName, invoiceFileName, paymentReminderFileName, creditFileName } from './filename';

vi.mock('../utils/utils', () => ({
  getPrintableDate: vi.fn(() => '10.12.2024'),
}));

const baseOrder = {
  id: 42,
  date: '2024-12-10',
  customer: { lastName: 'Meier' },
} as any;

describe('orderFileName', () => {
  test('basic filename', () => {
    expect(orderFileName(baseOrder)).toBe('10.12.2024_Meier_42.pdf');
  });

  test('with workersNumber', () => {
    const order = { ...baseOrder, workersNumber: 3 };
    expect(orderFileName(order)).toBe('10.12.2024_Meier_42_3.pdf');
  });

  test('with workersNumber and transporterNumber', () => {
    const order = { ...baseOrder, workersNumber: 2, transporterNumber: 1 };
    expect(orderFileName(order)).toBe('10.12.2024_Meier_42_2+1x3.5.pdf');
  });

  test('with timeBased hours', () => {
    const order = { ...baseOrder, timeBased: { hours: 5 } };
    expect(orderFileName(order)).toBe('10.12.2024_Meier_42_5_Std.pdf');
  });

  test('with parking slots', () => {
    const order = { ...baseOrder, from: { parkingSlot: true }, to: { parkingSlot: true } };
    expect(orderFileName(order)).toBe('10.12.2024_Meier_42_2xHVZ.pdf');
  });

  test('without customer lastName', () => {
    const order = { ...baseOrder, customer: {} };
    expect(orderFileName(order)).toBe('10.12.2024_Auftrag_42.pdf');
  });
});

describe('invoiceFileName', () => {
  test('with firma', () => {
    const rechnung = { rNumber: 'R-2024-001', firma: 'ABC GmbH', customerName: 'Max Meier' } as any;
    expect(invoiceFileName(rechnung)).toBe('R-R-2024-001 ABC GmbH.pdf');
  });

  test('removes salutation', () => {
    const rechnung = { rNumber: 'R-2024-002', customerName: 'Herr Max Meier' } as any;
    expect(invoiceFileName(rechnung)).toBe('R-R-2024-002 Max Meier.pdf');
  });
});

describe('paymentReminderFileName', () => {
  test('basic filename', () => {
    const rechnung = { rNumber: 'R-2024-001', customerName: 'Max Meier' } as any;
    expect(paymentReminderFileName(rechnung, 1)).toBe('Mahnung Nr.1 R-2024-001 Max Meier.pdf');
  });
});

describe('creditFileName', () => {
  test('with firma', () => {
    const rechnung = { firma: 'XYZ GmbH' } as any;
    const gutschrift = { gNumber: 'G-2024-001' } as any;
    expect(creditFileName(rechnung, gutschrift)).toBe('G-G-2024-001 XYZ GmbH.pdf');
  });
});
