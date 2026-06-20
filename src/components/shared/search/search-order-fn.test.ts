import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { searchOrder } from './search-order-fn';

beforeAll(() => {
  vi.stubGlobal('window', { UMCONFUrls: { nonce: 'test-nonce' } });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('searchOrder', () => {
  test('search by numeric ID', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve({ id: 42 }),
    });

    const search = searchOrder();
    const result = await search('42');
    expect(result).toEqual([{ id: 42 }]);
    expect(fetch).toHaveBeenCalledWith(
      '/wp-json/um-configurator/v1/order/42',
      { method: 'GET', headers: { 'X-WP-NONCE': 'test-nonce' } },
    );
  });

  test('search by name string', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve([{ id: 1, customer: { lastName: 'Meier' } }]),
    });

    const search = searchOrder();
    const result = await search('Meier');
    expect(result).toHaveLength(1);
    expect(fetch).toHaveBeenCalledWith(
      '/wp-json/um-configurator/v1/order/all?s=Meier',
      { method: 'GET', headers: { 'X-WP-NONCE': 'test-nonce' } },
    );
  });

  test('error returns empty array', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const search = searchOrder();
    const result = await search('42');
    expect(result).toEqual([]);
  });

  test('calls onFinally callback', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve([]),
    });

    const onFinally = vi.fn();
    const search = searchOrder(onFinally);
    await search('test');
    expect(onFinally).toHaveBeenCalledOnce();
  });
});
