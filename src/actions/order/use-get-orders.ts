import type { DataList } from 'src/interfaces/order';

import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_ORDERS } from './queries/get-order-data';

export function useGetOrders(pageSize: number, currentPage: number) {
  const variables = { page_size: pageSize, current_page: currentPage };
  const graphql = GraphQLService.getInstance();

  return useQuery({
    queryKey: ['graphql:getOrders', variables],
    queryFn: async () =>
      graphql.request<DataList, { page_size: number; current_page: number }>(GET_ORDERS, variables),
  });
}
