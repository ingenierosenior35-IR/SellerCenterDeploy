'use client';

import { gql } from 'graphql-request';

// ---------------------- Auth (email/password) ----------------------
export const LOGIN_MUTATION = gql`
  mutation GenerateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`;
