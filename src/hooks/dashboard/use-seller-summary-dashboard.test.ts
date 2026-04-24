import { renderHook } from '@testing-library/react';

import { useGetSellerSummaryDashboard } from 'src/actions/dashboard/use-get-seller-summary-dashboard';

import { useSellerSummaryDashboard } from './use-seller-summary-dashboard';

jest.mock('src/actions/dashboard/use-get-seller-summary-dashboard', () => ({
  useGetSellerSummaryDashboard: jest.fn(),
}));

describe('useSellerSummaryDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns hasLiveData true when summary is successful with data', () => {
    (useGetSellerSummaryDashboard as jest.Mock).mockReturnValue({
      summary: { success: true, data: { sales_account: {} }, message: '' },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useSellerSummaryDashboard());

    expect(result.current.hasLiveData).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('returns hasLiveData false when summary is unsuccessful', () => {
    (useGetSellerSummaryDashboard as jest.Mock).mockReturnValue({
      summary: { success: false, data: null, message: '' },
      isLoading: false,
      isError: true,
    });

    const { result } = renderHook(() => useSellerSummaryDashboard());

    expect(result.current.hasLiveData).toBe(false);
    expect(result.current.isError).toBe(true);
  });

  it('passes dateRange argument to underlying action hook', () => {
    (useGetSellerSummaryDashboard as jest.Mock).mockReturnValue({
      summary: { success: false, data: null, message: '' },
      isLoading: true,
      isError: false,
    });

    const range = { fromDate: '2024-01-01', toDate: '2024-12-31' };
    renderHook(() => useSellerSummaryDashboard(range));

    expect(useGetSellerSummaryDashboard).toHaveBeenCalledWith(range);
  });
});
