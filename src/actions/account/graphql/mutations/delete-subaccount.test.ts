import { DELETE_SUBACCOUNT_MUTATION } from './delete-subaccount';

describe('DELETE_SUBACCOUNT_MUTATION', () => {
  it('is a non-empty string', () => {
    expect(typeof DELETE_SUBACCOUNT_MUTATION).toBe('string');
    expect(DELETE_SUBACCOUNT_MUTATION.length).toBeGreaterThan(0);
  });

  it('contains deleteSubSellerAccount operation', () => {
    expect(DELETE_SUBACCOUNT_MUTATION).toContain('deleteSubSellerAccount');
  });

  it('declares DeleteSubSellerAccount mutation name', () => {
    expect(DELETE_SUBACCOUNT_MUTATION).toContain('DeleteSubSellerAccount');
  });

  it('includes all required input variables', () => {
    expect(DELETE_SUBACCOUNT_MUTATION).toContain('$customerId: String!');
    expect(DELETE_SUBACCOUNT_MUTATION).toContain('$id: String!');
  });

  it('requests message field', () => {
    expect(DELETE_SUBACCOUNT_MUTATION).toContain('message');
  });
});
