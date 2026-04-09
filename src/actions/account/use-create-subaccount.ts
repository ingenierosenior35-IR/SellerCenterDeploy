'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { CREATE_SUBACCOUNT_MUTATION } from './graphql/mutations/create-subaccount';


interface CreateSubAccountVariables {
  customerId?: string;
  firstname: string;
  lastname: string;
  permissionType: string;
  email: string;
  status: string;
}

interface CreateSubAccountResponse {
  createSellerSubAccount: {
    errorMessage: string;
    successMessage: string;
  };
}

export function useCreateSubAccount() {
  const graphql = GraphQLService.getInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CreateSubAccountVariables) =>
      graphql.request<CreateSubAccountResponse, CreateSubAccountVariables>(CREATE_SUBACCOUNT_MUTATION, variables),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['getSubSellerList'] });
    }
  });
}
