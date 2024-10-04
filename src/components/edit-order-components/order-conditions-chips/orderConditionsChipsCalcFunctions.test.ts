import { expect, test, describe, vi } from 'vitest';
import { isLocalMovement } from './orderConditionsChipsCalcFunctions';
import { Address } from 'um-types';

describe('orderConditionsChipsCalcFunctions', () => {
  test('is-local-movement, true', () => {
    const a = { address: 'München' } as Address;
    const b = { address: 'München' } as Address;
    expect(isLocalMovement(a, b)).toBe(true);
  });
});
