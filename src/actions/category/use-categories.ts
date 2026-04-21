'use client';

import type {
  CategoryChildInterface,
  CategoriesResponseInterface,
} from 'src/interfaces';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { GET_CATEGORIES_QUERY } from './graphql';

// ----------------------------------------------------------------------

/**
 * Hook que obtiene el árbol de categorías del catálogo con soporte multinivel.
 * Retorna la estructura para que los selectores de categoría puedan renderizar N niveles.
 */
export function useCategories() {
  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['graphql', 'categories'],
    queryFn: () => graphql.request<CategoriesResponseInterface>(GET_CATEGORIES_QUERY),
    refetchOnWindowFocus: false,
  });

  return useMemo(() => {
    const root = data?.categories?.items?.[0] ?? null;
    const categoryTree: CategoryChildInterface[] = Array.isArray(root?.children) ? root.children : [];

    return {
      categoryTree,
      categoriesRaw: data,
      categoriesLoading: isLoading,
      categoriesError: isError ? error : null,
      categoriesValidating: isFetching,
    };
  }, [data, isLoading, isError, error, isFetching]);
}
