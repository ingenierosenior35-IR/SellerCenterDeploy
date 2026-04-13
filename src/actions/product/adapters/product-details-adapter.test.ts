import { productDetailsAdapter } from './product-details-adapter';

jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets' },
}));

const makeProductItem = (overrides = {}) => ({
  id: 42,
  sku: 'SKU-DETAIL-001',
  name: 'Detail Product',
  categories: [{ name: 'Category A' }],
  stock_status: 'IN_STOCK',
  stock_saleable: 10,
  price_range: {
    minimum_price: {
      final_price: { value: 199.99 },
      discount: { amount_off: 20, percent_off: 10 },
    },
  },
  image: { url: 'https://example.com/cover.jpg' },
  media_gallery: [
    { url: 'https://example.com/g1.jpg', disabled: false },
    { url: 'https://example.com/g2.jpg', disabled: true },
  ],
  custom_attributes_info: {
    items: [
      { code: 'description', value: '<p>Full description</p>' },
      { code: 'short_description', value: 'Short desc' },
      { code: 'weight', value: '1.5' },
    ],
  },
  configurable_product_options_selection: {
    configurable_options: [{ id: 1, label: 'Color' }],
  },
  variants: [{ product: { sku: 'VAR-001' } }],
  ...overrides,
});

describe('productDetailsAdapter', () => {
  it('returns null when data is undefined', () => {
    expect(productDetailsAdapter(undefined)).toBeNull();
  });

  it('returns null when data has no sellerProducts', () => {
    expect(productDetailsAdapter({} as any)).toBeNull();
  });

  it('returns null when items is empty', () => {
    expect(productDetailsAdapter({ sellerProducts: { items: [] } } as any)).toBeNull();
  });

  it('maps product details correctly', () => {
    const data = { sellerProducts: { items: [makeProductItem()] } } as any;
    const result = productDetailsAdapter(data);
    expect(result).not.toBeNull();
    expect(result!.id).toBe(42);
    expect(result!.sku).toBe('SKU-DETAIL-001');
    expect(result!.name).toBe('Detail Product');
    expect(result!.category).toBe('Category A');
    expect(result!.inStock).toBe(true);
    expect(result!.stock).toBe(10);
    expect(result!.price).toBe(199.99);
    expect(result!.discount).toBe(20);
    expect(result!.discountPercent).toBe(10);
    expect(result!.coverUrl).toBe('https://example.com/cover.jpg');
    expect(result!.description).toBe('<p>Full description</p>');
    expect(result!.shortDescription).toBe('Short desc');
    expect(result!.weight).toBe('1.5');
  });

  it('includes only enabled gallery images', () => {
    const data = { sellerProducts: { items: [makeProductItem()] } } as any;
    const result = productDetailsAdapter(data);
    expect(result!.images).toEqual(['https://example.com/g1.jpg']);
  });

  it('falls back to coverUrl when gallery is empty', () => {
    const item = makeProductItem({ media_gallery: [] });
    const data = { sellerProducts: { items: [item] } } as any;
    const result = productDetailsAdapter(data);
    expect(result!.images).toEqual(['https://example.com/cover.jpg']);
  });

  it('uses fallback cover when image is missing', () => {
    const item = makeProductItem({ image: null });
    const data = { sellerProducts: { items: [item] } } as any;
    const result = productDetailsAdapter(data);
    expect(result!.coverUrl).toContain('/assets');
  });

  it('uses "-" when category is missing', () => {
    const item = makeProductItem({ categories: [] });
    const data = { sellerProducts: { items: [item] } } as any;
    const result = productDetailsAdapter(data);
    expect(result!.category).toBe('-');
  });

  it('sets inStock false for OUT_OF_STOCK', () => {
    const item = makeProductItem({ stock_status: 'OUT_OF_STOCK' });
    const data = { sellerProducts: { items: [item] } } as any;
    const result = productDetailsAdapter(data);
    expect(result!.inStock).toBe(false);
  });

  it('maps configurableOptions and variants', () => {
    const data = { sellerProducts: { items: [makeProductItem()] } } as any;
    const result = productDetailsAdapter(data);
    expect(result!.configurableOptions).toHaveLength(1);
    expect(result!.variants).toHaveLength(1);
  });
});
