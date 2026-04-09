'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { DELETE_SUBACCOUNT_MUTATION } from './graphql/mutations/delete-subaccount';

interface DeleteSubAccountVariables {
  customerId: string;
  id: string;
}

interface DeleteSubAccountResponse {
  deleteSubSellerAccount: {
    message: string;
  };
}

export function useDeleteSubAccount() {
  const graphql = GraphQLService.getInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: DeleteSubAccountVariables) =>
      graphql.request<DeleteSubAccountResponse, DeleteSubAccountVariables>(
        DELETE_SUBACCOUNT_MUTATION,
        variables
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['getSubSellerList'] });
    },
  });
}
