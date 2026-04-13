import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useGetReturns } from './useGetReturns';

const mockRequest = jest.fn();
jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest, setHeader: jest.fn() }),
  },
}));

jest.mock('src/auth/context/utils', () => ({
  getSession: jest.fn(() => null),
}));

const mockReturnsResponse = {
  customer: {
    returns: {
      total_count: 1,
      items: [
        {
          status: 'PENDING',
          total_refunded_amount: 50,
          uid: 'uid-1',
          created_at: '2024-01-01',
          number: 'RET-001',
          items: [
            {
              status: 'PENDING',
              uid: 'item-uid-1',
              quantity: 1,
              order_item: {
                id: 1,
                product_image: '/img.jpg',
                product_name: 'Product A',
                product_sku: 'SKU-A',
              },
            },
          ],
          customer: { email: 'user@test.com', firstname: 'John', lastname: 'Doe' },
          order: { order_number: 'ORDER-001' },
        },
      ],
      page_info: { current_page: 1, page_size: 10, total_pages: 1 },
    },
  },
};

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

describe('useGetReturns', () => {
  beforeEach(() => mockRequest.mockReset());

  it('returns isLoading true initially', () => {
    mockRequest.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useGetReturns(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns returns data after successful fetch', async () => {
    mockRequest.mockResolvedValue(mockReturnsResponse);
    const { result } = renderHook(() => useGetReturns(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.returns.returns?.totalCount).toBe(1);
    expect(result.current.isError).toBe(false);
  });

  it('returns isError true on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useGetReturns(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
