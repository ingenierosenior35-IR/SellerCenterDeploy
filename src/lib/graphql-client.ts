// src/lib/graphql/GraphQLService.ts

import { GraphQLClient } from 'graphql-request';

import { ENV } from 'src/environments';

import { getSession } from 'src/auth/context';

export class GraphQLService {
  private static instance: GraphQLService;
  private client: GraphQLClient;

  private constructor() {
    const urlBackend = ENV.urlBackend;

    if (!urlBackend) {
      throw new Error('NEXT_PUBLIC_BACKEND_GRAPHQL_URL is not defined');
    }

    const isBrowser = typeof window !== 'undefined';

    const localUrl = isBrowser
      ? `${window.location.origin}/api/magento/graphql`
      : '/api/magento/graphql';

    const endpoint =
      ENV.environment === 'local' ? localUrl : urlBackend;

    this.client = new GraphQLClient(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public static getInstance(): GraphQLService {
    if (!GraphQLService.instance) {
      GraphQLService.instance = new GraphQLService();

      if (getSession()) {
        GraphQLService.instance.setHeader('Authorization', `Bearer ${getSession()}`);
      }
    }

    return GraphQLService.instance;
  }

  public setHeader(key: string, value: string) {
    this.client.setHeader(key, value);
  }

  public async request<TData, TVariables extends Record<string, any> = Record<string, never>>(query: string, variables?: TVariables): Promise<TData> {
    return this.client.request<TData>(query, variables as TVariables);
  }
}
