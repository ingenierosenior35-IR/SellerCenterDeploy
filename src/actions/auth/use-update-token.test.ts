import React from 'react';
import { act, waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useUpdateToken } from './use-update-token';

const mockRequest = jest.fn();
const mockSetHeader = jest.fn();

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest, setHeader: mockSetHeader }),
  },
}));

const mockGetSession = jest.fn();
const mockSetSession = jest.fn();

jest.mock('src/auth/context/utils', () => ({
  getSession: () => mockGetSession(),
  setSession: (...args: unknown[]) => mockSetSession(...args),
}));

jest.mock('./graphql/mutations/refresh-token', () => ({
  REFRESH_TOKEN_MUTATION: 'REFRESH_TOKEN_MUTATION',
}));

const mockRefreshResponse = {
  refreshCustomerToken: { token: 'new-token-456' },
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useUpdateToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockReturnValue('current-token');
    mockRequest.mockResolvedValue(mockRefreshResponse);
  });

  it('starts in idle state', () => {
    const { result } = renderHook(() => useUpdateToken(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('throws when no current token exists', async () => {
    mockGetSession.mockReturnValue(null);
    const { result } = renderHook(() => useUpdateToken(), { wrapper: createWrapper() });
    await expect(result.current.mutateAsync()).rejects.toThrow('No token found to refresh');
  });

  it('calls graphql.request with mutation and current token', async () => {
    const { result } = renderHook(() => useUpdateToken(), { wrapper: createWrapper() });
    await act(() => result.current.mutateAsync());
    expect(mockRequest).toHaveBeenCalledWith('REFRESH_TOKEN_MUTATION', { token: 'current-token' });
  });

  it('stores new token via setSession', async () => {
    const { result } = renderHook(() => useUpdateToken(), { wrapper: createWrapper() });
    await act(() => result.current.mutateAsync());
    expect(mockSetSession).toHaveBeenCalledWith('new-token-456');
  });

  it('updates Authorization header with new token', async () => {
    const { result } = renderHook(() => useUpdateToken(), { wrapper: createWrapper() });
    await act(() => result.current.mutateAsync());
    expect(mockSetHeader).toHaveBeenCalledWith('Authorization', 'Bearer new-token-456');
  });

  it('throws when response has no token', async () => {
    mockRequest.mockResolvedValue({});
    const { result } = renderHook(() => useUpdateToken(), { wrapper: createWrapper() });
    await expect(result.current.mutateAsync()).rejects.toThrow('Failed to refresh token');
  });

  it('clears session on error via onError', async () => {
    mockRequest.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useUpdateToken(), { wrapper: createWrapper() });

    await act(async () => {
      try { await result.current.mutateAsync(); } catch { /* empty */ }
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockSetSession).toHaveBeenCalledWith(null);
  });
});
