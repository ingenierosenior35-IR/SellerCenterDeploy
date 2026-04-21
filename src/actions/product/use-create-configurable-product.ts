'use client';

import type { CreateConfigurableProductInput } from 'src/interfaces';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createConfigurableProduct } from './create-configurable-product';

// ----------------------------------------------------------------------

type CreateConfigurableResult = {
  status: string;
  skuStatus: { sku: string; created: boolean; message: string }[];
  message: string;
};

type UseCreateConfigurableProductOptions = {
  onSuccess?: (data: CreateConfigurableResult) => void;
  onError?: (error: Error) => void;
};

/**
 * Hook de React Query que encapsula la mutation de crear producto configurable.
 *
 * Recibe el input ya armado por useConfigurableProductPayload.
 * Al tener éxito, invalida la cache de productos.
 */
export function useCreateConfigurableProduct(options: UseCreateConfigurableProductOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['product', 'create-configurable'],
    mutationFn: (input: CreateConfigurableProductInput) => createConfigurableProduct(input),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['getProducts'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });
}
