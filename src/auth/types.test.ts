import type { UserType, AuthState, AuthContextValue } from './types';

describe('auth types', () => {
  it('allows UserType as object', () => {
    const user: UserType = { id: '1', name: 'Juan' };
    expect(user).toEqual({ id: '1', name: 'Juan' });
  });

  it('allows UserType as null', () => {
    const user: UserType = null;
    expect(user).toBeNull();
  });

  it('supports AuthState shape', () => {
    const state: AuthState = {
      user: { email: 'test@mail.com' },
      loading: false,
    };

    expect(state.loading).toBe(false);
    expect((state.user as Record<string, unknown>).email).toBe('test@mail.com');
  });

  it('supports AuthContextValue required flags', () => {
    const ctx: AuthContextValue = {
      user: null,
      loading: true,
      authenticated: false,
      unauthenticated: true,
    };

    expect(ctx.loading).toBe(true);
    expect(ctx.authenticated).toBe(false);
    expect(ctx.unauthenticated).toBe(true);
  });
});
