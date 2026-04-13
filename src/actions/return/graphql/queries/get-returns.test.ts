import { GET_RETURNS_QUERY } from './get-returns';

describe('get-returns graphql query', () => {
  it('is a non-empty string', () => {
    expect(typeof GET_RETURNS_QUERY).toBe('string');
    expect(GET_RETURNS_QUERY.length).toBeGreaterThan(0);
  });

  it('contains getReturns query', () => {
    expect(GET_RETURNS_QUERY).toContain('getReturns');
  });

  it('contains customer returns fields', () => {
    expect(GET_RETURNS_QUERY).toContain('customer');
    expect(GET_RETURNS_QUERY).toContain('returns');
  });

  it('contains total_count field', () => {
    expect(GET_RETURNS_QUERY).toContain('total_count');
  });
});
