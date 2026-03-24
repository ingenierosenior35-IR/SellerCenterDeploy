'use client';

import type { ICustomerGraphQLResponse } from 'src/interfaces/customer/customer.interface';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_CUSTOMER } from './graphql/queries';
import { CustomerAdapter } from './adapters/customer-adapter';

export function useGetCustomer() {
  const graphql = GraphQLService.getInstance();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['getCustomer'],
    queryFn: () => graphql.request<ICustomerGraphQLResponse, {}>(GET_CUSTOMER),
  });
  const customer = useMemo(() => CustomerAdapter(data!), [data]);
  return { customer, isLoading, isError, error };
}
