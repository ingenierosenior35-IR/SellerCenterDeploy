import { LOGIN_MUTATION } from './login';
import { LOGOUT_MUTATION } from './logout';

describe('auth graphql mutations', () => {
  it('LOGIN_MUTATION is a non-empty string', () => {
    expect(typeof LOGIN_MUTATION).toBe('string');
    expect(LOGIN_MUTATION.length).toBeGreaterThan(0);
  });

  it('LOGIN_MUTATION contains generateCustomerToken', () => {
    expect(LOGIN_MUTATION).toContain('generateCustomerToken');
  });

  it('LOGOUT_MUTATION is a non-empty string', () => {
    expect(typeof LOGOUT_MUTATION).toBe('string');
    expect(LOGOUT_MUTATION.length).toBeGreaterThan(0);
  });

  it('LOGOUT_MUTATION contains revokeCustomerToken', () => {
    expect(LOGOUT_MUTATION).toContain('revokeCustomerToken');
  });
});
