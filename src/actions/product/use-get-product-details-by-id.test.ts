import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useGetProductDetailsById } from './use-get-product-details-by-id';

const mockRequest = jest.fn();
jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest, setHeader: jest.fn() }),
  },
}));

jest.mock('src/auth/context/utils', () => ({
  getSession: jest.fn(() => null),
}));

const mockProductDetailsResponse = {
  sellerProducts: {
    items: [
      {
        id: 1,
        sku: 'SKU-001',
        name: 'Product 1',
        image: { url: '/img.jpg' },
        media_gallery: [{ url: '/img.jpg', disabled: false }],
        categories: [{ uid: 'cat-1', name: 'Electronics' }],
        price_range: {
          minimum_price: {
            regular_price: { value: 100 },
            final_price: { value: 90 },
            discount: { amount_off: 10, percent_off: 10 },
          },
        },
        stock_saleable: 5,
        stock_status: 'IN_STOCK',
        rating_summary: 80,
        custom_attributes_info: { items: [] },
        configurable_options: [],
        variants: [],
        description: { html: '<p>Description</p>' },
        short_description: { html: '' },
      },
    ],
  },
};

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

describe('useGetProductDetailsById', () => {
  beforeEach(() => mockRequest.mockReset());

  it('returns isLoading true initially for valid id', () => {
    mockRequest.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useGetProductDetailsById(1), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('does not fetch when id is 0', () => {
    const { result } = renderHook(() => useGetProductDetailsById(0), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(false);
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('returns product details after successful fetch', async () => {
    mockRequest.mockResolvedValue(mockProductDetailsResponse);
    const { result } = renderHook(() => useGetProductDetailsById(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.product).not.toBeNull();
    expect(result.current.product?.sku).toBe('SKU-001');
  });

  it('returns isError true on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Not found'));
    const { result } = renderHook(() => useGetProductDetailsById(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
