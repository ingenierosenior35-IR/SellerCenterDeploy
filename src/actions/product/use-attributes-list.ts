'use client';

import type { AttributesListResponse, AttributeSetAttributesResponse } from 'src/interfaces';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { ATTRIBUTES_LIST_QUERY, ATTRIBUTE_SET_ATTRIBUTES_QUERY } from './graphql';

const ATTRIBUTE_SET_ID = 4;

/** Hook que obtiene los atributos configurables de producto disponibles desde Magento. */
export function useAttributesList() {
  const graphql = GraphQLService.getInstance();

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['graphql', 'attributesList'],
    queryFn: () => graphql.request<AttributesListResponse>(ATTRIBUTES_LIST_QUERY),
    refetchOnWindowFocus: false,
  });

  const { data: setData, isLoading: setLoading } = useQuery({
    queryKey: ['graphql', 'attributeSetAttributes', ATTRIBUTE_SET_ID],
    queryFn: () =>
      graphql.request<AttributeSetAttributesResponse, { attributeSetId: number; isUserDefined: boolean }>(ATTRIBUTE_SET_ATTRIBUTES_QUERY, {
        attributeSetId: ATTRIBUTE_SET_ID,
        isUserDefined: true,
      }),
    refetchOnWindowFocus: false,
  });

  return useMemo(() => {
    const allItems = data?.attributesList?.items ?? [];
    const setItems = setData?.attributeSetAttributes?.items ?? [];

    // Mapa de attribute_code → attribute_id del attribute set (solo user-defined)
    const idMap = new Map(
      setItems
        .filter((a) => a.is_user_defined)
        .map((a) => [a.attribute_code, a.attribute_id])
    );

    // Solo atributos tipo SELECT, user-defined, con opciones válidas y del attribute set
    const configurableAttrs = allItems
      .filter(
        (attr) =>
          attr.frontend_input === 'SELECT' &&
          attr.options.length > 0 &&
          idMap.has(attr.code)
      )
      .map((attr) => ({
        ...attr,
        attribute_id: idMap.get(attr.code),
        options: attr.options.filter((opt) => opt.value !== '' && opt.value !== '0'),
      }))
      .filter((attr) => attr.options.length > 0);

    return {
      attributes: configurableAttrs,
      attributesLoading: isLoading || setLoading,
      attributesError: isError ? error : null,
      attributesValidating: isFetching,
    };
  }, [data, setData, isLoading, setLoading, isError, error, isFetching]);
}
