import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useLogout } from './use-logout';

const mockRequest = jest.fn();
const mockSetHeader = jest.fn();
jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({
      request: mockRequest,
      setHeader: mockSetHeader,
    }),
  },
}));

jest.mock('src/auth/context/utils', () => ({
  setSession: jest.fn(),
}));

jest.mock('./graphql', () => ({
  LOGOUT_MUTATION: 'LOGOUT_MUTATION',
}));

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useLogout', () => {
  beforeEach(() => {
    mockRequest.mockReset();
    mockSetHeader.mockReset();
  });

  it('returns a mutate function', () => {
    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });
    expect(typeof result.current.mutate).toBe('function');
  });

  it('calls graphql.request on mutate', async () => {
    mockRequest.mockResolvedValue({ revokeCustomerToken: { result: true } });
    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockRequest).toHaveBeenCalledWith('LOGOUT_MUTATION');
  });

  it('clears Authorization header on success', async () => {
    mockRequest.mockResolvedValue({ revokeCustomerToken: { result: true } });
    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockSetHeader).toHaveBeenCalledWith('Authorization', '');
  });

  it('sets isError on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Logout failed'));
    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
