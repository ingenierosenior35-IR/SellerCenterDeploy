import { GraphQLClient } from 'graphql-request';

class GraphQLClientSingleton {
  private static instance: GraphQLClient;

  private constructor() {}

  private static getGraphqlEndpoint() {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/api/graphql-proxy`;
    }

    return process.env.INTERNAL_GRAPHQL_PROXY_URL || 'http://localhost:8083/api/graphql-proxy';
  }

  public static getInstance(): GraphQLClient {
    if (!GraphQLClientSingleton.instance) {

      GraphQLClientSingleton.instance = new GraphQLClient(GraphQLClientSingleton.getGraphqlEndpoint(), {
        headers: { 'Content-Type': 'application/json' },

      });
    }
    return GraphQLClientSingleton.instance;
  }
}

export const graphqlClient = GraphQLClientSingleton.getInstance();
