'use client';

import { useMemo } from 'react';

import { useGetSellerSummaryDashboard } from 'src/actions/dashboard/use-get-seller-summary-dashboard';

type DateRange = {
  fromDate: string;
  toDate: string;
};

export function useSellerSummaryDashboard(dateRange?: DateRange) {
  const { summary, isLoading, isError } = useGetSellerSummaryDashboard(dateRange);

  const hasLiveData = useMemo(
    () => Boolean(summary.success && summary.data),
    [summary.data, summary.success]
  );

  return {
    summary,
    hasLiveData,
    isLoading,
    isError,
  };
}
