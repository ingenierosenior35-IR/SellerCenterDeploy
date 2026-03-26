'use client';

import type { GraphQLErrorResponseInterface } from 'src/interfaces/graphql';
import type { ProductDetailsUIInterface, ProductDetailsResponseInterface } from 'src/interfaces';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_PRODUCT_DETAILS_BY_ID_QUERY } from './graphql/queries';
import { productDetailsAdapter } from './adapters/product-details-adapter';

type Variables = { productId: string }; // <-- string, no number

export function useGetProductDetailsById(id: number) {
  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError } = useQuery<ProductDetailsResponseInterface>({
    queryKey: ['getProductDetailsById', id],
    queryFn: () =>
      graphql.request<ProductDetailsResponseInterface, Variables>(
        GET_PRODUCT_DETAILS_BY_ID_QUERY,
        { productId: String(id) } // <-- convertir a string aquí
      ),
    enabled: Number.isFinite(id) && id > 0,
  });

  const product = useMemo<ProductDetailsUIInterface | null>(
    () =>
      productDetailsAdapter(
        data as ProductDetailsResponseInterface | GraphQLErrorResponseInterface | undefined
      ),
    [data]
  );

  return { product, isLoading, isError };
}
