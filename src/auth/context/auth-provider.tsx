'use client';

import type { PropsWithChildren } from 'react';
import type { AuthStatus } from './auth-context';

import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useEffect, useCallback } from 'react';

import { useLogin } from 'src/actions/auth/use-login';
import { useLogout } from 'src/actions/auth/use-logout';
import { useCurrentUser } from 'src/actions/auth/use-current-user';
import { useUpdateToken } from 'src/actions/auth/use-update-token';

import { setSession } from './utils';
import { AuthContext } from './auth-context';

// ----------------------------------------------------------------------

export function AuthProvider({ children }: PropsWithChildren) {

  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const updateTokenMutation = useUpdateToken();
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
    await logoutMutation.mutateAsync(undefined, {
      onSettled: () => {
        queryClient.clear();
      },
    });

  }, [logoutMutation, queryClient]);


  const checkUserSession = useCallback(() => {
    if (authStatus === 'not-authenticated') {
      setSession(null);
    }
  }, [authStatus]);


  useEffect(() => {
    checkUserSession();
  }, [authStatus, checkUserSession]);

  // Refresh automático del token
  useEffect(() => {
    if (authStatus !== 'authenticated') return undefined;

    const tokenExpirationTime = parseInt(
      process.env.NEXT_PUBLIC_TOKEN_EXPIRATION_TIME || '30',
      10
    );
    const refreshTime = (tokenExpirationTime) * 60 * 1000;

    const timeoutId = setTimeout(async () => {
      await updateTokenMutation.mutateAsync();
    }, refreshTime);

    return () => clearTimeout(timeoutId);
  }, [authStatus, updateTokenMutation]);

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
