import { GET_REVIEWS_QUERY } from './get-feedback';

describe('get-feedback graphql query', () => {
  it('GET_REVIEWS_QUERY is a non-empty string', () => {
    expect(typeof GET_REVIEWS_QUERY).toBe('string');
    expect(GET_REVIEWS_QUERY.length).toBeGreaterThan(0);
  });

  it('contains sellerProducts query', () => {
    expect(GET_REVIEWS_QUERY).toContain('sellerProducts');
  });

  it('contains ratings_breakdown field', () => {
    expect(GET_REVIEWS_QUERY).toContain('ratings_breakdown');
  });
});
