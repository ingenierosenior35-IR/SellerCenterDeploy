'use client';

import type { ICustomer } from 'src/interfaces/customer/customer.interface';

import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { getSession } from 'src/auth/context';

import { GET_CURRENT_USER_QUERY } from './graphql/query/customer';

export const AUTH_USER_KEY = ['current-user'] as const;


interface CurrentUserGQLResponse {
  customer: ICustomer;
}

export function useCurrentUser() {
  const graphql = GraphQLService.getInstance();

  return useQuery({
    queryKey: AUTH_USER_KEY,
    queryFn: () =>
      graphql
        .request<CurrentUserGQLResponse, {}>(GET_CURRENT_USER_QUERY, {})
        .then((data) => {
          const customer = data.customer;
          return {
            email: customer.email ?? '',
            firstname: `${customer.firstname ?? ''}`,
            lastname: `${customer.lastname ?? ''}`,
          } as ICustomer;
        }),
    enabled: !!getSession(),
    retry: false,
  });
}
