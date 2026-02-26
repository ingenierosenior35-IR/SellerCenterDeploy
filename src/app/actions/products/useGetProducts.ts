'use client';

import { useQuery } from '@tanstack/react-query';

import { graphqlRequest } from 'src/lib/graphql-client';

import { GET_PRODUCTS_QUERY } from './queries';

export function useGetProducts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['getProducts'],
    queryFn: () => graphqlRequest<any, {}>(GET_PRODUCTS_QUERY),
    staleTime: 1000 * 60 * 5, // Mantiene los datos actualizados por 5 minutos
  });

  return { data, isLoading, isError };
}
