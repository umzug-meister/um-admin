import { isLocalMovement } from './orderConditionsChipsCalcFunctions';

import { Address } from 'um-types';
import { describe, expect, test } from 'vitest';

describe('orderConditionsChipsCalcFunctions', () => {
  test('is-local-movement, true', () => {
    const a = { address: 'München' } as Address;
    const b = { address: 'München' } as Address;
    expect(isLocalMovement(a, b)).toBe(true);
  });
});
