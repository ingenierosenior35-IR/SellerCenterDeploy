import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthContext } from './auth-context';
import { AuthProvider } from './auth-provider';

const setSessionMock = jest.fn();

const mockedUseCurrentUser = jest.fn(() => ({
  data: null as any,
  isLoading: false,
}));

const mockedLoginMutateAsync = jest.fn();
const mockedLogoutMutateAsync = jest.fn();
const mockedUpdateTokenMutateAsync = jest.fn();

jest.mock('src/actions/auth/use-current-user', () => ({
  useCurrentUser: () => mockedUseCurrentUser(),
}));

jest.mock('src/actions/auth/use-login', () => ({
  useLogin: () => ({ mutateAsync: mockedLoginMutateAsync }),
}));

jest.mock('src/actions/auth/use-logout', () => ({
  useLogout: () => ({ mutateAsync: mockedLogoutMutateAsync }),
}));

jest.mock('src/actions/auth/use-update-token', () => ({
  useUpdateToken: () => ({ mutateAsync: mockedUpdateTokenMutateAsync }),
}));

jest.mock('./utils', () => ({
  setSession: (...args: any[]) => setSessionMock(...args),
}));

function Probe() {
  return (
    <AuthContext.Consumer>
      {(ctx) => {
        if (!ctx) return null;
        return (
          <div>
            <span data-testid="loading">{String(ctx.loading)}</span>
            <span data-testid="authenticated">{String(ctx.authenticated)}</span>
            <span data-testid="unauthenticated">{String(ctx.unauthenticated)}</span>
            <span data-testid="name">{ctx.user?.firstname ?? 'none'}</span>
          </div>
        );
      }}
    </AuthContext.Consumer>
  );
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

describe('AuthProvider', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    setSessionMock.mockReset();
    mockedUseCurrentUser.mockReturnValue({ data: null, isLoading: false });
  });

  const renderWithProviders = (ui: React.ReactElement) =>
    render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);

  it('sets unauthenticated when no user', async () => {
    renderWithProviders(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('unauthenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });

    expect(setSessionMock).toHaveBeenCalledWith(null);
  });

  it('sets authenticated when user exists', async () => {
    mockedUseCurrentUser.mockReturnValue({
      data: { id: '1', firstname: 'Juan' },
      isLoading: false,
    });

    renderWithProviders(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('unauthenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('name')).toHaveTextContent('Juan');
    });
  });
});
