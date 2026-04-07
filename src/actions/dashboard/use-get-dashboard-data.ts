'use client';

import type {  DashboardData, SellerMetricsDashboard } from 'src/interfaces/dashboard/dashboard';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { dashboardDataAdapter } from './adapters/dashboard-data-adapter';
import { GET_DASHBOARD_DATA_QUERY } from './graphql/queries/get-dashboard-data';

export function useGetDashboardData(dateRange?: { today: string; sevenDaysAgo: string }) {

  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getDashboardData', dateRange?.today, dateRange?.sevenDaysAgo],
    queryFn: () => graphql.request<DashboardData, { fromDate: string; toDate: string }>(GET_DASHBOARD_DATA_QUERY, {
      fromDate: dateRange?.sevenDaysAgo || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      toDate: dateRange?.today || new Date().toISOString().split('T')[0],
    }),
    enabled: !!dateRange,
  });

  const returns = useMemo<SellerMetricsDashboard>(() => dashboardDataAdapter(data!), [data]);
  return { returns, isLoading, isError };
}
