import { renderHook } from '@testing-library/react';

import { useAuthContext } from './use-auth-context';
import { AuthContext } from '../context/auth-context';

describe('useAuthContext', () => {
  it('returns context value when used inside AuthContext provider', () => {
    const value = {
      user: { id: '1' } as any,
      authStatus: 'authenticated' as const,
      loading: false,
      authenticated: true,
      unauthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext value={value}>{children}</AuthContext>
    );

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    expect(result.current).toBe(value);
  });

  it('throws when used outside AuthContext provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useAuthContext())).toThrow(
      'useAuthContext: Context must be used inside AuthProvider'
    );

    consoleError.mockRestore();
  });
});
