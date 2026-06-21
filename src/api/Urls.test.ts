import { MailProxyUrls, Urls } from './Urls';

import { describe, expect, test } from 'vitest';

describe('Urls', () => {
  test('orders paginated', () => {
    expect(Urls.orders(1, 20)).toBe(
      '/wp-json/um-configurator/v1/order/all?posts_per_page=20&paged=1&order=DESC&orderby=ID',
    );
  });

  test('orderSearch', () => {
    expect(Urls.orderSearch('Meier')).toBe('/wp-json/um-configurator/v1/order/all?s=Meier');
  });

  test('orderById', () => {
    expect(Urls.orderById(42)).toBe('/wp-json/um-configurator/v1/order/42');
    expect(Urls.orderById()).toBe('/wp-json/um-configurator/v1/order/');
  });

  test('options', () => {
    expect(Urls.options('hvzPrice')).toBe('/wp-json/um-configurator/v1/options/hvzPrice');
    expect(Urls.options()).toBe('/wp-json/um-configurator/v1/options/');
  });

  test('services', () => {
    expect(Urls.services(5)).toBe('/wp-json/um-configurator/v1/service/5');
    expect(Urls.services()).toBe('/wp-json/um-configurator/v1/service/all');
  });

  test('categories', () => {
    expect(Urls.categories(3)).toBe('/wp-json/um-configurator/v1/item-category/3');
    expect(Urls.categories()).toBe('/wp-json/um-configurator/v1/item-category/all');
  });

  test('items', () => {
    expect(Urls.items(7)).toBe('/wp-json/um-configurator/v1/item/7');
    expect(Urls.items()).toBe('/wp-json/um-configurator/v1/item/all');
  });
});
