import { useMutation } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { setSession } from 'src/auth/context/utils';

import { LOGOUT_MUTATION } from "./graphql";


interface LogoutResponse {
  revokeCustomerToken: {
    result: boolean;
  };
}

export function useLogout() {
  const graphql = GraphQLService.getInstance();
  return useMutation({
    mutationFn: () => graphql.request<LogoutResponse>(LOGOUT_MUTATION),
    onSuccess: (data) => {
      const response = data?.revokeCustomerToken?.result;
      if (!response)
        console.warn('Logout failed');

      graphql.setHeader('Authorization', '');
    },
    onSettled: () => {
      setSession(null);
    },
  });
}
