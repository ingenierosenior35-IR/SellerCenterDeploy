import { returnsListAdapter } from './return-list-adapter';

jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets' },
}));

const makeReturnItem = (overrides = {}) => ({
  status: 'PENDING',
  total_refunded_amount: 50,
  uid: 'uid-001',
  created_at: '2024-01-15',
  number: 'RMA-001',
  customer: { email: 'user@test.com', firstname: 'John', lastname: 'Doe' },
  order: { order_number: 'ORD-123' },
  items: [
    {
      status: 'PENDING',
      uid: 'item-uid-001',
      quantity: 1,
      order_item: {
        id: 1,
        product_image: 'https://example.com/product.jpg',
        product_name: 'Product A',
        product_sku: 'SKU-A',
      },
    },
  ],
  ...overrides,
});

const makeData = (items = [makeReturnItem()]) => ({
  customer: {
    returns: {
      total_count: items.length,
      page_info: { current_page: 1, page_size: 10, total_pages: 1 },
      items,
    },
  },
});

describe('returnsListAdapter', () => {
  it('returns empty object when data is undefined', () => {
    const result = returnsListAdapter(undefined as any);
    expect(result).toEqual({});
  });

  it('returns empty object when data has no customer key', () => {
    const result = returnsListAdapter({} as any);
    expect(result).toEqual({});
  });

  it('maps return items correctly', () => {
    const result = returnsListAdapter(makeData() as any);
    expect(result.returns.totalCount).toBe(1);
    const item = result.returns.items[0];
    expect(item.status).toBe('PENDING');
    expect(item.uid).toBe('uid-001');
    expect(item.number).toBe('RMA-001');
    expect(item.customer.email).toBe('user@test.com');
    expect(item.customer.name).toBe('John Doe');
    expect(item.order.orderNumber).toBe('ORD-123');
  });

  it('maps nested items correctly', () => {
    const result = returnsListAdapter(makeData() as any);
    const nestedItem = result.returns.items[0].items[0];
    expect(nestedItem.status).toBe('PENDING');
    expect(nestedItem.quantity).toBe(1);
    expect(nestedItem.orderItem.productName).toBe('Product A');
    expect(nestedItem.orderItem.productSku).toBe('SKU-A');
    expect(nestedItem.orderItem.productImage).toBe('https://example.com/product.jpg');
  });

  it('uses fallback image when product_image is null', () => {
    const data = makeData([
      makeReturnItem({
        items: [
          {
            status: 'PENDING',
            uid: 'item-uid-002',
            quantity: 1,
            order_item: { id: 2, product_image: null, product_name: 'B', product_sku: 'SKU-B' },
          },
        ],
      }),
    ]);
    const result = returnsListAdapter(data as any);
    expect(result.returns.items[0].items[0].orderItem.productImage).toContain('/assets');
  });

  it('maps page info correctly', () => {
    const result = returnsListAdapter(makeData() as any);
    expect(result.pageInfo.currentPage).toBe(1);
    expect(result.pageInfo.pageSize).toBe(10);
    expect(result.pageInfo.totalPages).toBe(1);
  });

  it('handles missing customer name fields', () => {
    const data = makeData([
      makeReturnItem({ customer: { email: 'x@x.com', firstname: null, lastname: null } }),
    ]);
    const result = returnsListAdapter(data as any);
    expect(result.returns.items[0].customer.name).toBe(' ');
  });
});
