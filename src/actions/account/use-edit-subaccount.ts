'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { UPDATE_SUBACCOUNT_MUTATION } from './graphql/mutations/update-subaccount';

interface UpdateSubAccountVariables {
  id: string;
  customerId?: string;
  firstname: string;
  lastname: string;
  permissionType: string;
  email: string;
  status: string;
}

interface UpdateSubAccountResponse {
  updateSellerSubAccount: {
    message: string;
  };
}

export function useUpdateSubAccount() {
  const graphql = GraphQLService.getInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: UpdateSubAccountVariables) =>
      graphql.request<UpdateSubAccountResponse, UpdateSubAccountVariables>(UPDATE_SUBACCOUNT_MUTATION, variables),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['getSubSellerList'] });
    }
  });
}
