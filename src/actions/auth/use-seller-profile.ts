'use client';

import { useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { getSession } from 'src/auth/context';

import { GET_SELLER_PROFILE_QUERY } from './graphql/query/customer';
import {
  sellerProfileAdapter,
  type SellerProfileGQLResponse,
} from './adapters/seller-profile.adapter';

// ----------------------------------------------------------------------

export const SELLER_PROFILE_KEY = ['seller-profile'] as const;

/**
 * Query independiente del seller profile.
 *
 * Está separada de `useCurrentUser` (que es crítico para autenticación) para
 * que un fallo aquí —campo no disponible en el ambiente, error de red,
 * customer sin seller_profile— NUNCA tumbe la sesión del usuario.
 *
 * Los consumidores (p.ej. `useSellerStatus`) deben tratar el resultado como
 * opcional y aplicar fallbacks razonables.
 */
export function useSellerProfile() {
  const graphql = GraphQLService.getInstance();

  return useQuery({
    queryKey: SELLER_PROFILE_KEY,
    queryFn: () =>
      graphql
        .request<SellerProfileGQLResponse, {}>(GET_SELLER_PROFILE_QUERY, {})
        // React Query exige que queryFn no devuelva `undefined`; usamos `null`
        // como marcador de "sin perfil" — los consumidores leen con `?.`.
        .then((data) => sellerProfileAdapter(data) ?? null),
    enabled: !!getSession(),
    retry: false,
    // Si la query falla, devolvemos `data: undefined` sin propagar el error
    // a los consumidores.
    throwOnError: false,
  });
}
