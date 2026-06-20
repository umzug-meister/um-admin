import { describe, expect, test } from 'vitest';
import { notificationsReducer, addNotification, removeAllNotifications } from './notificationReducer';

describe('notificationsReducer', () => {
  test('adds notification', () => {
    const state = notificationsReducer(
      [],
      addNotification({ message: 'Erfolg', severity: 'success' }),
    );
    expect(state).toHaveLength(1);
    expect(state[0].message).toBe('Erfolg');
    expect(state[0].severity).toBe('success');
  });

  test('adds multiple notifications', () => {
    const state = [
      { message: 'Info', severity: 'info' },
      { message: 'Fehler', severity: 'error' },
    ].reduce(
      (s, n) => notificationsReducer(s, addNotification(n)),
      [] as any[],
    );
    expect(state).toHaveLength(2);
  });

  test('removes all notifications', () => {
    const state = notificationsReducer(
      [{ message: 'Test', severity: 'info' }],
      removeAllNotifications(),
    );
    expect(state).toEqual([]);
  });
});
