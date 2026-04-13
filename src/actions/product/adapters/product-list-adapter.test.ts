import { productListAdapter } from './product-list-adapter';

jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets' },
}));

jest.mock('src/locales', () => ({
  DEFAULT_LANG: 'es',
}));

const makeProduct = (overrides = {}) => ({
  id: 1,
  sku: 'SKU-001',
  name: 'Test Product',
  custom_attributes_info: { items: [] },
  thumbnail: { url: 'https://example.com/thumb.jpg' },
  categories: [{ name: 'Electronics' }],
  price_range: {
    minimum_price: {
      regular_price: { value: 99.99 },
      discount: { amount_off: 10, percent_off: 10 },
    },
  },
  stock_saleable: 50,
  stock_status: 'IN_STOCK',
  rating_summary: 80,
  ...overrides,
});

describe('productListAdapter', () => {
  it('returns empty array when data is undefined', () => {
    expect(productListAdapter(undefined, 'es')).toEqual([]);
  });

  it('returns empty array when data has no sellerProducts', () => {
    expect(productListAdapter({} as any, 'es')).toEqual([]);
  });

  it('returns empty array when items is null', () => {
    expect(productListAdapter({ sellerProducts: { items: null } } as any, 'es')).toEqual([]);
  });

  it('maps product fields correctly', () => {
    const data = { sellerProducts: { items: [makeProduct()] } } as any;
    const result = productListAdapter(data, 'es');
    expect(result).toHaveLength(1);
    const p = result[0];
    expect(p.id).toBe(1);
    expect(p.sku).toBe('SKU-001');
    expect(p.productName).toBe('Test Product');
    expect(p.thumbnailUrl).toBe('https://example.com/thumb.jpg');
    expect(p.category).toBe('Electronics');
    expect(p.finalPrice).toBe(99.99);
    expect(p.discount).toBe(10);
    expect(p.discountPercent).toBe(10);
    expect(p.stock).toBe(50);
    expect(p.inStock).toBe(true);
    expect(p.rating).toBe(80);
  });

  it('uses fallback image when thumbnail is missing', () => {
    const data = { sellerProducts: { items: [makeProduct({ thumbnail: null })] } } as any;
    const result = productListAdapter(data, 'es');
    expect(result[0].thumbnailUrl).toContain('/assets');
  });

  it('uses "-" when category is missing', () => {
    const data = { sellerProducts: { items: [makeProduct({ categories: [] })] } } as any;
    const result = productListAdapter(data, 'es');
    expect(result[0].category).toBe('-');
  });

  it('sets inStock false for OUT_OF_STOCK', () => {
    const data = {
      sellerProducts: { items: [makeProduct({ stock_status: 'OUT_OF_STOCK' })] },
    } as any;
    const result = productListAdapter(data, 'es');
    expect(result[0].inStock).toBe(false);
  });

  it('uses custom_attributes_info name when lang is not default', () => {
    const product = makeProduct({
      custom_attributes_info: { items: [{ value: 'Nombre personalizado' }] },
    });
    const data = { sellerProducts: { items: [product] } } as any;
    const result = productListAdapter(data, 'en');
    expect(result[0].productName).toBe('Nombre personalizado');
  });

  it('handles multiple products', () => {
    const data = {
      sellerProducts: { items: [makeProduct(), makeProduct({ id: 2, sku: 'SKU-002' })] },
    } as any;
    const result = productListAdapter(data, 'es');
    expect(result).toHaveLength(2);
  });
});
