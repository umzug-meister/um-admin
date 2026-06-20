import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { appRequest } from './fetch-client';

beforeAll(() => {
  vi.stubGlobal('window', { UMCONFUrls: { nonce: 'test-nonce' } });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('appRequest GET', () => {
  test('successful JSON response', async () => {
    const mockData = { id: 1, name: 'test' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve(mockData),
    });

    const get = appRequest('GET');
    const result = await get('/test');
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/test', { method: 'GET', headers: { 'X-WP-NONCE': 'test-nonce' } });
  });

  test('successful text response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({}),
      text: () => Promise.resolve('ok'),
    });

    const get = appRequest('GET');
    const result = await get('/test');
    expect(result).toBe('ok');
    expect(fetch).toHaveBeenCalledWith('/test', { method: 'GET', headers: { 'X-WP-NONCE': 'test-nonce' } });
  });

  test('error response with HTML entities', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve({ message: 'Fehler: &#34;test&#34;' }),
    });

    const get = appRequest('GET');
    await expect(get('/test')).rejects.toThrow('Fehler: "test"');
  });
});

describe('appRequest PUT', () => {
  test('sends JSON body', async () => {
    const mockData = { id: 1 };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve(mockData),
    });

    const put = appRequest('PUT');
    const result = await put('/test', { name: 'foo' });
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('/test', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-WP-NONCE': 'test-nonce' },
      body: JSON.stringify({ name: 'foo' }),
    });
  });
});

describe('appRequest POST', () => {
  test('sends JSON body with custom headers', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve({ success: true }),
    });

    const post = appRequest('POST');
    const result = await post('/test', { data: 1 }, { 'X-Custom': 'val' });
    expect(result).toEqual({ success: true });
    expect(fetch).toHaveBeenCalledWith('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Custom': 'val' },
      body: JSON.stringify({ data: 1 }),
    });
  });
});

describe('appRequest DELETE', () => {
  test('calls DELETE method', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve({ deleted: true }),
    });

    const del = appRequest('DELETE');
    const result = await del('/test/1');
    expect(result).toEqual({ deleted: true });
  });
});
