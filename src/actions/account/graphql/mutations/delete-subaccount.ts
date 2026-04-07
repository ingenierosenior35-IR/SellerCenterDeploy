import { gql } from 'graphql-request';

export const DELETE_SUBACCOUNT_MUTATION = gql`
  mutation DeleteSubSellerAccount($customerId: String!, $id: String!) {
    deleteSubSellerAccount(customerId: $customerId, id: $id) {
      message
    }
  }
`;
