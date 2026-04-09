'use client';

import { gql } from 'graphql-request';

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshCustomerToken($token: String!) {
    refreshCustomerToken(token: $token) {
      token
    }
  }
`;
