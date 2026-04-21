'use client';

import type { CreateSimpleProductVariables } from 'src/interfaces';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createProduct } from './create-product';

// ----------------------------------------------------------------------

type UseCreateProductOptions = {
  onSuccess?: (data: { sku: string; success: boolean }) => void;
  onError?: (error: Error) => void;
};

/**
 * Hook de React Query que encapsula la mutation de crear producto simple.
 *
 * Recibe las variables ya armadas por useSimpleProductPayload.
 * Al tener éxito, invalida la cache de productos.
 */
export function useCreateProduct(options: UseCreateProductOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['product', 'create'],
    mutationFn: (variables: CreateSimpleProductVariables) => createProduct(variables),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['getProducts'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
