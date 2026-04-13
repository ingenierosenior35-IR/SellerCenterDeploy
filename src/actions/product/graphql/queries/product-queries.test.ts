import { GET_PRODUCTS_QUERY } from './get-products';
import { SELLER_PRODUCTS_QUERY } from './seller-products';

describe('product graphql queries', () => {
  describe('GET_PRODUCTS_QUERY', () => {
    it('is a non-empty string', () => {
      expect(typeof GET_PRODUCTS_QUERY).toBe('string');
      expect(GET_PRODUCTS_QUERY.length).toBeGreaterThan(0);
    });

    it('contains products query', () => {
      expect(GET_PRODUCTS_QUERY).toContain('products');
    });
  });

  describe('SELLER_PRODUCTS_QUERY', () => {
    it('is a non-empty string', () => {
      expect(typeof SELLER_PRODUCTS_QUERY).toBe('string');
      expect(SELLER_PRODUCTS_QUERY.length).toBeGreaterThan(0);
    });

    it('contains sellerProducts query', () => {
      expect(SELLER_PRODUCTS_QUERY).toContain('sellerProducts');
    });

    it('contains sku field', () => {
      expect(SELLER_PRODUCTS_QUERY).toContain('sku');
    });
  });
});
