import { feedbackListAdapter } from './feedback-list-adapter';

jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets' },
}));

const makeReview = (overrides = {}) => ({
  average_rating: 80,
  created_at: '2024-01-01',
  nickname: 'user1',
  summary: 'Great product',
  text: 'Very good',
  status: 'APPROVED',
  ratings_breakdown: [
    { name: 'Price', value: '4' },
    { name: 'Quality', value: '5' },
  ],
  ...overrides,
});

const makeItem = (reviewOverrides = {}) => ({
  sku: 'SKU-001',
  name: 'Test Product',
  image: { url: 'https://example.com/image.jpg' },
  rating_summary: 80,
  review_count: 1,
  reviews: { items: [makeReview(reviewOverrides)] },
});

describe('feedbackListAdapter', () => {
  it('returns empty array when data is undefined', () => {
    const result = feedbackListAdapter(undefined);
    expect(result.feedbackListAdapter).toEqual([]);
  });

  it('returns empty array when sellerProducts is missing', () => {
    const result = feedbackListAdapter({} as any);
    expect(result.feedbackListAdapter).toEqual([]);
  });

  it('returns empty array when items is null', () => {
    const result = feedbackListAdapter({ sellerProducts: { items: null } } as any);
    expect(result.feedbackListAdapter).toEqual([]);
  });

  it('maps review data correctly', () => {
    const data = { sellerProducts: { items: [makeItem()] } } as any;
    const result = feedbackListAdapter(data);
    expect(result.feedbackListAdapter).toHaveLength(1);
    const item = result.feedbackListAdapter[0];
    expect(item.sku).toBe('SKU-001');
    expect(item.name).toBe('Test Product');
    expect(item.nickname).toBe('user1');
    expect(item.image).toBe('https://example.com/image.jpg');
  });

  it('uses fallback image when item image is missing', () => {
    const itemNoImage = { ...makeItem(), image: null };
    const data = { sellerProducts: { items: [itemNoImage] } } as any;
    const result = feedbackListAdapter(data);
    expect(result.feedbackListAdapter[0].image).toContain('/assets');
  });

  it('skips reviews with empty ratings_breakdown', () => {
    const item = makeItem({ ratings_breakdown: [] });
    const data = { sellerProducts: { items: [item] } } as any;
    const result = feedbackListAdapter(data);
    expect(result.feedbackListAdapter).toHaveLength(0);
  });

  it('handles multiple items with multiple reviews', () => {
    const data = {
      sellerProducts: {
        items: [
          makeItem(),
          { ...makeItem(), sku: 'SKU-002', reviews: { items: [makeReview(), makeReview()] } },
        ],
      },
    } as any;
    const result = feedbackListAdapter(data);
    expect(result.feedbackListAdapter).toHaveLength(3);
  });
});
