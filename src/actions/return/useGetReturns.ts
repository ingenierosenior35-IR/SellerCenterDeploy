'use client';

import type { PageListInfo } from 'src/interfaces/graphql/graphql-shared.interfaces';
import type { ReturnListRequestInterface, ReturnListResponseInterface } from 'src/interfaces';

import { useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_RETURNS_QUERY } from './graphql';
import { returnsListAdapter } from './adapters/return-list-adapter';

export function useGetReturns(returnsPerPage: PageListInfo) {
  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['getReturns', returnsPerPage],
    queryFn: () =>
      graphql.request<ReturnListResponseInterface, PageListInfo>(GET_RETURNS_QUERY, returnsPerPage),
    placeholderData: keepPreviousData,
  });

  const returns = useMemo<ReturnListRequestInterface>(() => returnsListAdapter(data!), [data]);
  return { returns, isLoading, isError, isFetching };
}
