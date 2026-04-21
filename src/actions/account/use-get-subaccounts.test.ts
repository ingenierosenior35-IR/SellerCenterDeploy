import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useGetSubAccounts } from './use-get-subaccounts';


const mockRequest = jest.fn();

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest }),
  },
}));


const mockApiResponse = [
  {
    entity_id: 101,
    name: 'John Doe',
    email: 'john@example.com',
    status: 1,
    created_at: '2025-01-15',
    customer_id: 1,
    seller_id: 1,
    permissionType: ['catalog', 'orders'],
  },
  {
    entity_id: 102,
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 0,
    created_at: '2025-02-20',
    customer_id: 1,
    seller_id: 1,
    permissionType: ['catalog'],
  },
];


const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};


describe('useGetSubAccounts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(() => '123');
    mockRequest.mockResolvedValue({ getSubSellerList: mockApiResponse });
  });

  it('starts with isLoading true and empty accounts', () => {
    mockRequest.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useGetSubAccounts(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.accounts).toEqual([]);
  });

  it('returns adapted accounts after fetch resolves', async () => {
    const { result } = renderHook(() => useGetSubAccounts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.accounts).toHaveLength(2);
    expect(result.current.isError).toBe(false);
  });

  it('accounts have the correct adapted fields', async () => {
    const { result } = renderHook(() => useGetSubAccounts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.accounts.length).toBeGreaterThan(0));

    const account = result.current.accounts[0];
    expect(account).toMatchObject({
      id: 101,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      status: 'ACTIVE',
      createdAt: '2025-01-15',
    });
    expect(Array.isArray(account.permissions)).toBe(true);
  });

  it('maps inactive status correctly', async () => {
    const { result } = renderHook(() => useGetSubAccounts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.accounts.length).toBe(2));

    expect(result.current.accounts[1].status).toBe('INACTIVE');
  });

  it('returns empty accounts and isError on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGetSubAccounts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.accounts).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
