import { describe, expect, test } from 'vitest';
import { appReducer, initOrder, setOrder, setUnsavedChanges, pushItem, deleteItem, initCredit } from './appReducer';

const mockFurniture = { id: 1, name: 'Schrank', selectedCategory: 'Schlafzimmer', colli: '2' } as any;

describe('appReducer', () => {
  test('initOrder sets current and unsavedChanges', () => {
    const state = appReducer(undefined, initOrder());
    expect(state.current).toBeTruthy();
    expect(state.current!.customer).toEqual({ telNumber: '' });
    expect(state.unsavedChanges).toBe(true);
  });

  test('setOrder replaces current', () => {
    const order = { id: 42, customer: { lastName: 'Meier' } } as any;
    const state = appReducer(undefined, setOrder(order));
    expect(state.current?.id).toBe(42);
  });

  test('setUnsavedChanges', () => {
    const state = appReducer(undefined, setUnsavedChanges({ unsavedChanges: true }));
    expect(state.unsavedChanges).toBe(true);
    const next = appReducer(state, setUnsavedChanges({ unsavedChanges: false }));
    expect(next.unsavedChanges).toBe(false);
  });

  test('pushItem adds item to beginning', () => {
    const state = appReducer(
      { current: { items: [] }, options: {} as any, unsavedChanges: false },
      pushItem({ item: mockFurniture }),
    );
    expect(state.current!.items).toHaveLength(1);
    expect(state.current!.items[0].name).toBe('Schrank');
    expect(state.unsavedChanges).toBe(true);
  });

  test('deleteItem removes item', () => {
    const state = appReducer(
      { current: { items: [mockFurniture] }, options: {} as any, unsavedChanges: false },
      deleteItem({ item: mockFurniture }),
    );
    expect(state.current!.items).toHaveLength(0);
  });

  test('deleteItem does nothing for non-existent item', () => {
    const state = appReducer(
      { current: { items: [mockFurniture] }, options: {} as any, unsavedChanges: false },
      deleteItem({ item: { id: 99, name: 'Tisch', selectedCategory: 'Küche' } } as any),
    );
    expect(state.current!.items).toHaveLength(1);
  });

  test('initCredit creates gutschrift', () => {
    const state = appReducer(
      { current: { options: {} } as any, options: { gNumber: 'G-001' } as any, unsavedChanges: false },
      initCredit(),
    );
    expect(state.current!.gutschrift).toBeTruthy();
    expect(state.current!.gutschrift.gNumber).toBe('G-001');
  });
});
