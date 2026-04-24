'use client';

import type { SellerSummaryDashboardPayload, SellerSummaryDashboardResponse } from 'src/interfaces/dashboard/seller-summary-dashboard';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { sellerSummaryDashboardAdapter } from './adapters/seller-summary-dashboard-adapter';
import { GET_SELLER_SUMMARY_DASHBOARD_QUERY } from './graphql/queries/get-seller-summary-dashboard';

type DateRange = {
  fromDate: string;
  toDate: string;
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];

function getDefaultDateRange(): DateRange {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setFullYear(toDate.getFullYear() - 2);

  return {
    fromDate: formatDate(fromDate),
    toDate: formatDate(toDate),
  };
}

export function useGetSellerSummaryDashboard(dateRange?: DateRange) {
  const graphql = GraphQLService.getInstance();

  const resolvedDateRange = dateRange ?? getDefaultDateRange();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['sellerSummaryDashboard', resolvedDateRange.fromDate, resolvedDateRange.toDate],
    queryFn: () =>
      graphql.request<SellerSummaryDashboardResponse, DateRange>(GET_SELLER_SUMMARY_DASHBOARD_QUERY, {
        fromDate: resolvedDateRange.fromDate,
        toDate: resolvedDateRange.toDate,
      }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const summary = useMemo<SellerSummaryDashboardPayload>(
    () => sellerSummaryDashboardAdapter(data),
    [data]
  );

  return { summary, isLoading, isError };
}
