import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { getSession, setSession } from 'src/auth/context/utils';

import { LOGIN_MUTATION } from "./graphql";
import { AUTH_USER_KEY } from './use-current-user';

interface LoginResponse {
  generateCustomerToken: {
    token: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const graphql = GraphQLService.getInstance();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const data = await graphql.request<LoginResponse, LoginCredentials>(LOGIN_MUTATION, credentials)

      const token = data?.generateCustomerToken?.token;
      if (!token) throw new Error('Invalid credentials');

      setSession(token);
      graphql.setHeader('Authorization', `Bearer ${getSession()}`);

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: AUTH_USER_KEY });
    },
  });
}
