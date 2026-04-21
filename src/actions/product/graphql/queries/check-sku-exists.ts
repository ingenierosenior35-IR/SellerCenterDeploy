import { gql } from 'graphql-request';

export const CHECK_SKU_EXISTS_QUERY = gql`
  query CheckSkuExists($sku: String!) {
    sellerProducts(
      filter: { sku: { eq: $sku } }
      currentPage: 1
      pageSize: 1
    ) {
      total_count
    }
  }
`;
