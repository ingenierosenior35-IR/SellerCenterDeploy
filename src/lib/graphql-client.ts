import { GraphQLClient } from 'graphql-request';

import { ENV } from 'src/environments';

const urlBackend = ENV.urlBackend;
if (!urlBackend) {
  throw new Error('NEXT_PUBLIC_BACKEND_GRAPHQL_URL is not defined');
}

// Configuración del cliente GraphQL con soporte para CORS en desarrollo local
const isBrowser = typeof window !== 'undefined';
const localUrl = isBrowser
  ? `${window.location.origin}/api/magento/graphql`
  : '/api/magento/graphql';

// Configuración del cliente
export const client = new GraphQLClient(ENV.environment === 'local' ? localUrl : urlBackend, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export const graphqlRequest = async <TData, TVariables extends Record<string, any> = Record<string, never>>(
  query: string,
  variables?: TVariables
): Promise<TData> => client.request<TData>(query, variables as TVariables);
