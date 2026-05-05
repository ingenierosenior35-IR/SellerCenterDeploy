import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useCurrentUser } from './use-current-user';

const mockRequest = jest.fn();

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest }),
  },
}));

const mockGetSession = jest.fn();

jest.mock('src/auth/context', () => ({
  getSession: () => mockGetSession(),
}));

jest.mock('./graphql/query/customer', () => ({
  GET_CURRENT_USER_QUERY: 'GET_CURRENT_USER_QUERY',
}));

const mockCustomerResponse = {
  customer: {
    email: 'john@example.com',
    firstname: 'John',
    lastname: 'Doe',
  },
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useCurrentUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest.mockResolvedValue(mockCustomerResponse);
  });

  it('does not fetch when session is null', async () => {
    mockGetSession.mockReturnValue(null);
    const { result } = renderHook(() => useCurrentUser(), { wrapper: createWrapper() });

    await new Promise((r) => setTimeout(r, 50));
    expect(mockRequest).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
  });

  it('starts loading when session exists', () => {
    mockGetSession.mockReturnValue('valid-token');
    mockRequest.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useCurrentUser(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns adapted user after fetch', async () => {
    mockGetSession.mockReturnValue('valid-token');
    const { result } = renderHook(() => useCurrentUser(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject({
      email: 'john@example.com',
      firstname: 'John',
      lastname: 'Doe',
    });
  });

  it('calls graphql.request with correct query', async () => {
    mockGetSession.mockReturnValue('valid-token');
    const { result } = renderHook(() => useCurrentUser(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockRequest).toHaveBeenCalledWith('GET_CURRENT_USER_QUERY', {});
  });

  it('sets isError on failure', async () => {
    mockGetSession.mockReturnValue('valid-token');
    mockRequest.mockRejectedValue(new Error('Server error'));
    const { result } = renderHook(() => useCurrentUser(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
