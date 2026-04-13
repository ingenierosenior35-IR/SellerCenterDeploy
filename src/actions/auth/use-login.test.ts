import React from 'react';
import { act, waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useLogin } from './use-login';

const mockRequest = jest.fn();
const mockSetHeader = jest.fn();

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest, setHeader: mockSetHeader }),
  },
}));

const mockSetSession = jest.fn();
const mockGetSession = jest.fn(() => 'fake-token');

jest.mock('src/auth/context/utils', () => ({
  setSession: (...args: unknown[]) => mockSetSession(...args),
  getSession: () => mockGetSession(),
}));

jest.mock('./graphql', () => ({
  LOGIN_MUTATION: 'LOGIN_MUTATION',
}));

jest.mock('./use-current-user', () => ({
  AUTH_USER_KEY: ['current-user'],
}));

const credentials = { email: 'test@example.com', password: 'Passw0rd!' };

const mockLoginResponse = {
  generateCustomerToken: { token: 'jwt-token-123' },
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.mockResolvedValue(mockLoginResponse);
  });

  it('starts in idle state', () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('calls graphql.request with LOGIN_MUTATION and credentials', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
    await act(() => result.current.mutateAsync(credentials));
    expect(mockRequest).toHaveBeenCalledWith('LOGIN_MUTATION', credentials);
  });

  it('stores token via setSession on success', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
    await act(() => result.current.mutateAsync(credentials));
    expect(mockSetSession).toHaveBeenCalledWith('jwt-token-123');
  });

  it('sets Authorization header after login', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
    await act(() => result.current.mutateAsync(credentials));
    expect(mockSetHeader).toHaveBeenCalledWith('Authorization', 'Bearer fake-token');
  });

  it('invalidates current-user query on success', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const spy = jest.spyOn(queryClient, 'invalidateQueries');
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);

    const { result } = renderHook(() => useLogin(), { wrapper });
    await act(() => result.current.mutateAsync(credentials));
    expect(spy).toHaveBeenCalledWith({ queryKey: ['current-user'] });
  });

  it('throws when token is empty', async () => {
    mockRequest.mockResolvedValue({ generateCustomerToken: { token: '' } });
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
    await expect(result.current.mutateAsync(credentials)).rejects.toThrow('Invalid credentials');
  });

  it('throws when response structure is invalid', async () => {
    mockRequest.mockResolvedValue({});
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
    await expect(result.current.mutateAsync(credentials)).rejects.toThrow('Invalid credentials');
  });

  it('sets isError on network failure', async () => {
    mockRequest.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    await act(async () => {
      try { await result.current.mutateAsync(credentials); } catch { /* empty */ }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockSetSession).not.toHaveBeenCalled();
  });
});
