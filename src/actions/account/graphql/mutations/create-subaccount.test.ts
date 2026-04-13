import { CREATE_SUBACCOUNT_MUTATION } from './create-subaccount';

describe('CREATE_SUBACCOUNT_MUTATION', () => {
  it('is a non-empty string', () => {
    expect(typeof CREATE_SUBACCOUNT_MUTATION).toBe('string');
    expect(CREATE_SUBACCOUNT_MUTATION.length).toBeGreaterThan(0);
  });

  it('contains createSellerSubAccount operation', () => {
    expect(CREATE_SUBACCOUNT_MUTATION).toContain('createSellerSubAccount');
  });

  it('declares CreateSellerSubAccount mutation name', () => {
    expect(CREATE_SUBACCOUNT_MUTATION).toContain('CreateSellerSubAccount');
  });

  it('includes all required input variables', () => {
    expect(CREATE_SUBACCOUNT_MUTATION).toContain('$customerId: String!');
    expect(CREATE_SUBACCOUNT_MUTATION).toContain('$firstname: String!');
    expect(CREATE_SUBACCOUNT_MUTATION).toContain('$lastname: String!');
    expect(CREATE_SUBACCOUNT_MUTATION).toContain('$email: String!');
    expect(CREATE_SUBACCOUNT_MUTATION).toContain('$permissionType: String!');
    expect(CREATE_SUBACCOUNT_MUTATION).toContain('$status: String!');
  });

  it('requests errorMessage and successMessage fields', () => {
    expect(CREATE_SUBACCOUNT_MUTATION).toContain('errorMessage');
    expect(CREATE_SUBACCOUNT_MUTATION).toContain('successMessage');
  });
});
