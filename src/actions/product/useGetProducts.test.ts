import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useGetProducts } from './useGetProducts';

const mockRequest = jest.fn();
jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest, setHeader: jest.fn() }),
  },
}));

jest.mock('src/auth/context/utils', () => ({
  getSession: jest.fn(() => null),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ currentLang: 'es', translate: (k: string) => k }),
}));

const mockProductsResponse = {
  sellerProducts: {
    items: [
      {
        id: 1,
        sku: 'SKU-001',
        name: 'Product 1',
        thumbnail: { url: '/img.jpg' },
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
      },
    ],
  },
};

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

describe('useGetProducts', () => {
  beforeEach(() => mockRequest.mockReset());

  it('returns isLoading true initially', () => {
    mockRequest.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useGetProducts(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns products after successful fetch', async () => {
    mockRequest.mockResolvedValue(mockProductsResponse);
    const { result } = renderHook(() => useGetProducts(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].sku).toBe('SKU-001');
    expect(result.current.isError).toBe(false);
  });

  it('returns isError true on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useGetProducts(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
