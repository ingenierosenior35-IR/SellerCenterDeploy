import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useSellerProfile } from './use-seller-profile';

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
  GET_SELLER_PROFILE_QUERY: 'GET_SELLER_PROFILE_QUERY',
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useSellerProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not fetch when there is no session', async () => {
    mockGetSession.mockReturnValue(null);
    const { result } = renderHook(() => useSellerProfile(), { wrapper: createWrapper() });
    await new Promise((r) => setTimeout(r, 50));
    expect(mockRequest).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
  });

  it('returns the adapted profile on success', async () => {
    mockGetSession.mockReturnValue('token');
    mockRequest.mockResolvedValue({
      customer: {
        seller_profile: {
          seller_id: 1,
          seller_status: 1,
          seller_status_label: 'Aprobado',
          shop_url: 'WeShopHk',
        },
      },
    });
    const { result } = renderHook(() => useSellerProfile(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({
      sellerId: 1,
      status: 'APPROVED',
      statusCode: 1,
      statusLabel: 'Aprobado',
      shopUrl: 'WeShopHk',
    });
  });

  it('does NOT throw when the backend errors — returns undefined data', async () => {
    mockGetSession.mockReturnValue('token');
    mockRequest.mockRejectedValue(new Error('Field seller_profile not found'));
    const { result } = renderHook(() => useSellerProfile(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it('returns null when seller_profile is missing on a valid response', async () => {
    mockGetSession.mockReturnValue('token');
    mockRequest.mockResolvedValue({ customer: { seller_profile: null } });
    const { result } = renderHook(() => useSellerProfile(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });
});
