import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useGetFeedback } from './use-get-feedback';

const mockRequest = jest.fn();
jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest, setHeader: jest.fn() }),
  },
}));

jest.mock('src/auth/context/utils', () => ({
  getSession: jest.fn(() => null),
}));

const mockFeedbackResponse = {
  sellerProducts: {
    items: [
      {
        sku: 'SKU-001',
        name: 'Product 1',
        rating_summary: 80,
        review_count: 2,
        image: { url: '/img.jpg' },
        reviews: {
          items: [
            {
              average_rating: 80,
              created_at: '2024-01-01',
              nickname: 'user1',
              summary: 'Great',
              text: 'Very good',
              ratings_breakdown: [{ name: 'Price', value: '4' }],
              status: 'APPROVED',
            },
          ],
        },
      },
    ],
  },
};

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

describe('useGetFeedback', () => {
  beforeEach(() => mockRequest.mockReset());

  it('returns isLoading true initially', () => {
    mockRequest.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useGetFeedback(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns reviews after successful fetch', async () => {
    mockRequest.mockResolvedValue(mockFeedbackResponse);
    const { result } = renderHook(() => useGetFeedback(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.reviews.feedbackListAdapter).toHaveLength(1);
    expect(result.current.isError).toBe(false);
  });

  it('returns isError true on failure', async () => {
    mockRequest.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useGetFeedback(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('passes filter to the query when provided', async () => {
    mockRequest.mockResolvedValue(mockFeedbackResponse);
    const { result } = renderHook(
      () => useGetFeedback({ filter: { rating: { eq: '4' } } }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockRequest).toHaveBeenCalled();
  });
});
