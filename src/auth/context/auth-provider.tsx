'use client';

import type { PropsWithChildren } from 'react';
import type { AuthStatus } from './auth-context';

import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useEffect, useCallback } from 'react';

import { useLogin } from 'src/actions/auth/use-login';
import { useLogout } from 'src/actions/auth/useLogout';
import { useCurrentUser } from 'src/actions/auth/use-current-user';

import { setSession } from './utils';
import { AuthContext } from './auth-context';

// ----------------------------------------------------------------------

export function AuthProvider({ children }: PropsWithChildren) {

  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const { data: user, isLoading } = useCurrentUser();


  const authStatus: AuthStatus = isLoading
    ? 'checking'
    : user
      ? 'authenticated'
      : 'not-authenticated';

  const handleLogin = useCallback(
    async (credentials: { email: string; password: string }) => {
      await loginMutation.mutateAsync(credentials);
    },
    [loginMutation]
  );

  const handleLogout = useCallback(async() => {
    console.log('Logging out user:', user);

    await logoutMutation.mutateAsync(undefined, {
      onSettled: () => {
        queryClient.clear();
      },
    });

  }, [logoutMutation, queryClient, user]);


  const checkUserSession = useCallback(() => {
    if (authStatus === 'not-authenticated') {
      setSession(null);
    }
  }, [authStatus]);

  useEffect(() => {
    checkUserSession();
  }, [authStatus, checkUserSession]);

  const memoizedValue = useMemo(
    () => ({
      user,
      authStatus,
      loading: authStatus === 'checking',
      authenticated: authStatus === 'authenticated',
      unauthenticated: authStatus === 'not-authenticated',

      login: handleLogin,
      logout: handleLogout,
    }),
    [authStatus, handleLogin, handleLogout, user]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
