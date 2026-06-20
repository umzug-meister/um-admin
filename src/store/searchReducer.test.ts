import { describe, expect, test } from 'vitest';
import { searchReducer, addSearchResults } from './searchReducer';

describe('searchReducer', () => {
  test('adds search result', () => {
    const state = searchReducer({ all: [] }, addSearchResults({ searchValue: 'Meier' }));
    expect(state.all).toEqual(['Meier']);
  });

  test('does not add duplicates', () => {
    const state = searchReducer({ all: ['Meier'] }, addSearchResults({ searchValue: 'Meier' }));
    expect(state.all).toEqual(['Meier']);
  });

  test('adds multiple unique values', () => {
    const state = ['Meier', 'Schmidt'].reduce(
      (s, v) => searchReducer(s, addSearchResults({ searchValue: v })),
      { all: [] },
    );
    expect(state.all).toEqual(['Meier', 'Schmidt']);
  });
});
