'use client';

import type { PropsWithChildren } from 'react';
import type { AuthState } from '../types';

import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import { useMockedUser } from 'src/auth/hooks';

import { setSession } from './utils';
import { AuthContext } from './auth-context';
import { ACCESS_TOKEN_STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export function AuthProvider({ children }: PropsWithChildren) {
  const { state, setState } = useSetState<AuthState>({ user: null, loading: true });
  const { user } = useMockedUser();

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

      if (accessToken) {
        setSession(accessToken);
        setState({ user: { ...user }, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch {
      setState({ user: null, loading: false });
    }
  }, [setState, user]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user, role: state.user?.role ?? 'admin' } : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
