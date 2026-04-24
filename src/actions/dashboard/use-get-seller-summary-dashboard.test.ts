import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useGetSellerSummaryDashboard } from './use-get-seller-summary-dashboard';

const mockRequest = jest.fn();

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: {
    getInstance: () => ({ request: mockRequest, setHeader: jest.fn() }),
  },
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

describe('useGetSellerSummaryDashboard', () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  it('returns isLoading true initially', () => {
    mockRequest.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useGetSellerSummaryDashboard(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
  });

  it('returns summary data when request succeeds', async () => {
    mockRequest.mockResolvedValue({
      sellerSummaryDashboard: {
        success: true,
        message: 'ok',
        data: {
          sales_account: { total_sales: 1, total_returns: 0 },
          orders_account: {
            created_orders: 2,
            pending_payment_orders: 0,
            pending_return_orders: 0,
            canceled_orders: 0,
            returned_orders: 0,
          },
          products_account: {
            created_products: 3,
            active_products: 3,
            inactive_products: 0,
            pending_approval_products: 0,
            out_of_stock_products: 0,
          },
          logistics_account: {
            pending_shipment_orders: 4,
            shipped_orders: 0,
            delivered_orders: 0,
          },
          reputation_account: {
            reviews_count: 1,
            stars_count: 95,
          },
        },
      },
    });

    const range = { fromDate: '2024-01-01', toDate: '2024-12-31' };
    const { result } = renderHook(() => useGetSellerSummaryDashboard(range), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.summary.success).toBe(true);
    expect(result.current.summary.data?.orders_account.created_orders).toBe(2);
    expect(mockRequest).toHaveBeenCalledWith(expect.any(String), range);
  });

  it('returns isError true when request fails', async () => {
    mockRequest.mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useGetSellerSummaryDashboard(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('uses default date range when no range is provided', async () => {
    mockRequest.mockResolvedValue({ sellerSummaryDashboard: { success: true, message: '', data: null } });

    renderHook(() => useGetSellerSummaryDashboard(), { wrapper: createWrapper() });

    await waitFor(() => expect(mockRequest).toHaveBeenCalled());

    const variables = mockRequest.mock.calls[0][1];
    expect(variables.fromDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(variables.toDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
