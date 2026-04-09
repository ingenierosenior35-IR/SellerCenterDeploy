import { useMutation } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { getSession, setSession } from 'src/auth/context/utils';

import { REFRESH_TOKEN_MUTATION } from './graphql/mutations/refresh-token';

interface RefreshTokenResponse {
  refreshCustomerToken: {
    token: string;
  };
}

export const useUpdateToken = () => {
  const graphql = GraphQLService.getInstance();

  return useMutation({
    mutationFn: async () => {
      const currentToken = getSession();
      if (!currentToken) {
        throw new Error('No token found to refresh');
      }

      const data = await graphql.request<RefreshTokenResponse, {}>(REFRESH_TOKEN_MUTATION, {
        token: currentToken,
      });

      const newToken = data?.refreshCustomerToken?.token;
      if (!newToken) {
        throw new Error('Failed to refresh token');
      }

      setSession(newToken);
      graphql.setHeader('Authorization', `Bearer ${newToken}`);

      return newToken;
    },
    onError: (error) => {
      setSession(null);
    },
  });
};
