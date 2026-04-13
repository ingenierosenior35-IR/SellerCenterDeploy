import { getInitials } from './get-initials';

describe('getInitials', () => {
  it('returns initials from firstName and lastName', () => {
    expect(getInitials({ firstName: 'John', lastName: 'Doe', email: '' })).toBe('JD');
  });

  it('returns initials uppercased', () => {
    expect(getInitials({ firstName: 'ana', lastName: 'garcia', email: '' })).toBe('AG');
  });

  it('uses displayName when no first/last name', () => {
    expect(getInitials({ displayName: 'John Doe', email: '' })).toBe('JD');
  });

  it('returns first letter of displayName when only one word', () => {
    expect(getInitials({ displayName: 'Madonna', email: '' })).toBe('M');
  });

  it('falls back to first letter of email', () => {
    expect(getInitials({ email: 'user@example.com' })).toBe('U');
  });

  it('returns "U" when all fields are empty', () => {
    expect(getInitials({ email: '' })).toBe('U');
  });

  it('returns only first initial if lastName is empty', () => {
    expect(getInitials({ firstName: 'John', lastName: '', email: '' })).toBe('J');
  });

  it('handles undefined optional fields gracefully', () => {
    expect(getInitials({})).toBe('U');
  });
});
