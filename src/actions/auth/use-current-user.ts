'use client';

import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { getSession } from 'src/auth/context';

import { GET_CURRENT_USER_QUERY } from './graphql/query/customer';
import { currentUserAdapter, type CurrentUserGQLResponse } from './adapters/current-user.adapter';

export const AUTH_USER_KEY = ['current-user'] as const;

export type { CurrentUserGQLResponse };

export function useCurrentUser() {
  const graphql = GraphQLService.getInstance();

  return useQuery({
    queryKey: AUTH_USER_KEY,
    queryFn: () =>
      graphql
        .request<CurrentUserGQLResponse, {}>(GET_CURRENT_USER_QUERY, {})
        .then((data) => currentUserAdapter(data)),
    enabled: !!getSession(),
    retry: false,
  });
}
