import { gql } from 'graphql-request';

export const GET_SUBACCOUNTS_QUERY = gql`
query GetSellerSubAccounts($customerId: String!) {
    getSubSellerList(customerId: $customerId) {
      created_at
      customer_id
      email
      entity_id
      name
      permissionType
      seller_id
      status
    }
}
`;
