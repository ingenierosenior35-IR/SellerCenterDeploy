'use client';

import type { ClientListData, SellerCustomersResponse } from 'src/interfaces/clients/client-list';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_CUSTOMERS } from './graphql/queries';
import { clientsAdapter } from './adapters/clients-adapter';

export function useGetClients() {

  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getCustomerData'],
    queryFn: () => graphql.request<ClientListData, {}>(GET_CUSTOMERS),
  });

  const customers = useMemo<SellerCustomersResponse>(() => clientsAdapter(data), [data]);
  return { customers, isLoading, isError };
}
