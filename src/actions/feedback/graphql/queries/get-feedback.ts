import { gql } from 'graphql-request';

export const GET_REVIEWS_QUERY = gql`
  query SellerProducts($filter: SellerProductFilterInput, $pageSize: Int, $currentPage: Int) {
    sellerProducts(pageSize: $pageSize, currentPage: $currentPage, filter: $filter) {
      items {
        reviews {
          items {
            average_rating
            created_at
            nickname
            summary
            text
            ratings_breakdown {
              name
              value
            }
            status
          }
        }
        review_count
        image {
          url
        }
        name
        sku
        rating_summary
      }
    }
  }
`;
