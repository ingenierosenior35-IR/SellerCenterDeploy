import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthContext } from './auth-context';
import { AuthProvider } from './auth-provider';

const mockedSetSession = jest.fn();
const mockedUser = { id: 'u-1', firstname: 'User A' };

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
  setSession: (...args: any[]) => mockedSetSession(...args),
}));

const Consumer = () => (
  <AuthContext.Consumer>
    {(value) => (
      <div>
        <div data-testid="loading">{String(value?.loading)}</div>
        <div data-testid="auth">{String(value?.authenticated)}</div>
        <div data-testid="unauth">{String(value?.unauthenticated)}</div>
        <div data-testid="name">{value?.user?.firstname ?? 'none'}</div>
      </div>
    )}
  </AuthContext.Consumer>
);

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

describe('auth context/provider coverage harness', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    mockedSetSession.mockReset();
    mockedUseCurrentUser.mockReturnValue({ data: null, isLoading: false });
  });

  const renderWithProviders = (ui: React.ReactElement) =>
    render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);

  it('provides unauthenticated state when no user', async () => {
    renderWithProviders(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(screen.getByTestId('auth')).toHaveTextContent('false');
    expect(screen.getByTestId('unauth')).toHaveTextContent('true');
    expect(screen.getByTestId('name')).toHaveTextContent('none');
    expect(mockedSetSession).toHaveBeenCalledWith(null);
  });

  it('shows loading state while checking user', async () => {
    mockedUseCurrentUser.mockReturnValue({ data: null, isLoading: true });

    renderWithProviders(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    expect(screen.getByTestId('auth')).toHaveTextContent('false');
    expect(screen.getByTestId('unauth')).toHaveTextContent('false');
  });

  it('provides authenticated state when user exists', async () => {
    mockedUseCurrentUser.mockReturnValue({ data: mockedUser, isLoading: false });

    renderWithProviders(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(screen.getByTestId('auth')).toHaveTextContent('true');
    expect(screen.getByTestId('unauth')).toHaveTextContent('false');
    expect(screen.getByTestId('name')).toHaveTextContent('User A');
  });
});
