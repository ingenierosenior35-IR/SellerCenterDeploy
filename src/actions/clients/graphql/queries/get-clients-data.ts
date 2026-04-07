import { gql } from 'graphql-request';

export const GET_CUSTOMERS = gql`
  query SellerCustomers {
    sellerCustomers {
      message
      success
      total_count
      data {
        customer_since
        email
        full_name
        location
      }
    }
  }
`;
