'use client';

import type { ReturnListRequestInterface, ReturnListResponseInterface } from 'src/interfaces';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_RETURNS_QUERY } from './graphql';
import { returnsListAdapter } from './adapters/return-list-adapter';

export function useGetReturns() {

  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getReturns'],
    queryFn: () => graphql.request<ReturnListResponseInterface, {}>(GET_RETURNS_QUERY),
  });

  const returns = useMemo<ReturnListRequestInterface>(() => returnsListAdapter(data!), [data]);
  return { returns, isLoading, isError };
}
