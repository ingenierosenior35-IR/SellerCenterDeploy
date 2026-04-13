import { GET_PRODUCT_DETAILS_BY_ID_QUERY } from './get-product-details-by-id';

describe('get-product-details-by-id graphql query', () => {
  it('is a non-empty string', () => {
    expect(typeof GET_PRODUCT_DETAILS_BY_ID_QUERY).toBe('string');
    expect(GET_PRODUCT_DETAILS_BY_ID_QUERY.length).toBeGreaterThan(0);
  });

  it('contains GetProductDetailsById query name', () => {
    expect(GET_PRODUCT_DETAILS_BY_ID_QUERY).toContain('GetProductDetailsById');
  });

  it('contains sellerProducts field', () => {
    expect(GET_PRODUCT_DETAILS_BY_ID_QUERY).toContain('sellerProducts');
  });
});
