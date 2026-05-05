import { sellerProfileAdapter } from './seller-profile.adapter';

describe('sellerProfileAdapter', () => {
  it.each([
    [0, 'PENDING'],
    [1, 'APPROVED'],
    [2, 'PROCESSING'],
    [3, 'DISABLED'],
    [4, 'DENIED'],
  ])('maps seller_status %s to %s', (code, expected) => {
    const result = sellerProfileAdapter({
      customer: {
        seller_profile: {
          seller_id: 7,
          seller_status: code,
          seller_status_label: 'Label',
          shop_url: 'shop',
        },
      },
    });
    expect(result?.status).toBe(expected);
    expect(result?.statusCode).toBe(code);
    expect(result?.sellerId).toBe(7);
    expect(result?.statusLabel).toBe('Label');
    expect(result?.shopUrl).toBe('shop');
  });

  it('returns undefined when customer is null', () => {
    expect(sellerProfileAdapter({ customer: null })).toBeUndefined();
  });

  it('returns undefined when seller_profile is null', () => {
    expect(sellerProfileAdapter({ customer: { seller_profile: null } })).toBeUndefined();
  });

  it('returns undefined when seller_profile is missing', () => {
    expect(sellerProfileAdapter({ customer: {} })).toBeUndefined();
  });

  it('leaves status undefined for an unknown numeric code', () => {
    const result = sellerProfileAdapter({
      customer: {
        seller_profile: {
          seller_id: 1,
          seller_status: 42,
          seller_status_label: 'Unknown',
          shop_url: '',
        },
      },
    });
    expect(result?.status).toBeUndefined();
    expect(result?.statusCode).toBe(42);
  });
});
