import type { DataDetail } from 'src/interfaces/order/order-detail';

import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_ORDER_DETAIL } from './queries/get-order-data';

export function useGetOrderDetail(incrementId: string) {
  const variables = { increment_id: incrementId };
  const graphql = GraphQLService.getInstance();

  return useQuery({
    queryKey: ['graphql:getOrderDetail', variables],
    queryFn: async () => graphql.request<DataDetail, { increment_id: string }>(GET_ORDER_DETAIL, variables),
  });
}
