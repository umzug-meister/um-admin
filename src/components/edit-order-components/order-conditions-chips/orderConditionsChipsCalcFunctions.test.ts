import { describe, expect, test } from 'vitest';
import { calculateRideCostsByKm } from './orderConditionsChipsCalcFunctions';

describe('calculateRideCostsByKm', () => {
  test('calculates and rounds to nearest 5', () => {
    const result = calculateRideCostsByKm({ distance: 100, kmPrice: 2.5, transporterAmount: 1 });
    expect(result).toBe(250);
  });

  test('with multiple transporters', () => {
    const result = calculateRideCostsByKm({ distance: 50, kmPrice: 2, transporterAmount: 2 });
    expect(result).toBe(200);
  });

  test('with undefined values defaults to 0', () => {
    const result = calculateRideCostsByKm({ distance: undefined, kmPrice: undefined, transporterAmount: undefined });
    expect(result).toBe(0);
  });

  test('string values are parsed', () => {
    const result = calculateRideCostsByKm({ distance: '30', kmPrice: '1.5', transporterAmount: '1' });
    expect(result).toBe(45);
  });

  test('small values round correctly', () => {
    const result = calculateRideCostsByKm({ distance: 3, kmPrice: 1, transporterAmount: 1 });
    expect(result).toBe(5);
  });
});
