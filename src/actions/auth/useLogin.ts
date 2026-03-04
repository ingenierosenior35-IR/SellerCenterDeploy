import { useMutation } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { getSession, setSession } from 'src/auth/context/utils';

import { LOGIN_MUTATION } from "./graphql";


interface LoginResponse {
  generateCustomerToken: {
    token: string;
  };
}

export function useLogin() {
  const graphql = GraphQLService.getInstance();
  return useMutation({
    mutationFn: (variables: any) => graphql.request<LoginResponse>(LOGIN_MUTATION, variables),
    onSuccess: async (data) => {
      const token = await data.generateCustomerToken.token;
      setSession(token);

      graphql.setHeader('Authorization', `Bearer ${getSession()}`);
    },
  });
}
