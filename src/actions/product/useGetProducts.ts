'use client';

import type { ProductListInterface, SellerProductsResponseInterface } from 'src/interfaces';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { GraphQLService } from 'src/lib/graphql-client';

import { SELLER_PRODUCTS_QUERY } from './graphql/queries';
import { productListAdapter } from './adapters/product-list-adapter';

export function useGetProducts() {

  const graphql = GraphQLService.getInstance();
  const { currentLang } = useTranslate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getProducts'],
    queryFn: () => graphql.request<SellerProductsResponseInterface, {}>(SELLER_PRODUCTS_QUERY),
    // staleTime: 1000 * 60 * 5, // Mantiene los datos actualizados por 5 minutos
  });

  const products = useMemo<ProductListInterface[]>(() => productListAdapter(data, currentLang), [data, currentLang]);
  return { products, isLoading, isError };
}
