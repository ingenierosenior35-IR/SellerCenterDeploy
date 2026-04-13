import { UPDATE_SUBACCOUNT_MUTATION } from './update-subaccount';

describe('UPDATE_SUBACCOUNT_MUTATION', () => {
  it('is a non-empty string', () => {
    expect(typeof UPDATE_SUBACCOUNT_MUTATION).toBe('string');
    expect(UPDATE_SUBACCOUNT_MUTATION.length).toBeGreaterThan(0);
  });

  it('contains updateSellerSubAccount operation', () => {
    expect(UPDATE_SUBACCOUNT_MUTATION).toContain('updateSellerSubAccount');
  });

  it('declares UpdateSellerSubAccount mutation name', () => {
    expect(UPDATE_SUBACCOUNT_MUTATION).toContain('UpdateSellerSubAccount');
  });

  it('includes all required input variables', () => {
    expect(UPDATE_SUBACCOUNT_MUTATION).toContain('$customerId: String!');
    expect(UPDATE_SUBACCOUNT_MUTATION).toContain('$id: String!');
    expect(UPDATE_SUBACCOUNT_MUTATION).toContain('$firstname: String!');
    expect(UPDATE_SUBACCOUNT_MUTATION).toContain('$lastname: String!');
    expect(UPDATE_SUBACCOUNT_MUTATION).toContain('$email: String!');
    expect(UPDATE_SUBACCOUNT_MUTATION).toContain('$permissionType: String!');
    expect(UPDATE_SUBACCOUNT_MUTATION).toContain('$status: String!');
  });

  it('requests message field', () => {
    expect(UPDATE_SUBACCOUNT_MUTATION).toContain('message');
  });
});
