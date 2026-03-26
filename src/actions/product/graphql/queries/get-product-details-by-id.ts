import { gql } from 'graphql-request';

export const GET_PRODUCT_DETAILS_BY_ID_QUERY = gql`
  query GetProductDetailsById($productId: String!) {
    sellerProducts(
      filter: { product_id: { eq: $productId } }
      currentPage: 1
      pageSize: 1
    ) {
      total_count
      items {
        __typename
        id
        uid
        sku
        name
        stock_status
        stock_saleable
        updated_at
        categories {
          name
          uid
          level
        }
        price_range {
          minimum_price {
            regular_price { value }
            final_price { value }
            discount { amount_off percent_off }
          }
        }
        custom_attributes_info(
          filters: { code: { in: ["description", "short_description", "weight"] } }
        ) {
          items { code value }
        }
        image { url }
        media_gallery { disabled label position url }

        ... on ConfigurableProduct {
          configurable_product_options_selection {
            configurable_options {
              uid
              label
              frontend_input
              values {
                label
                is_available
                uid
                swatch { image_url }
              }
            }
          }
          variants {
            product {
              __typename
              id
              uid
              sku
              name
              stock_status
              stock_saleable
              updated_at
              categories { name uid level }
              price_range {
                minimum_price {
                  regular_price { value }
                  final_price { value }
                  discount { amount_off percent_off }
                }
              }
              custom_attributes_info(
                filters: { code: { in: ["description", "short_description", "weight"] } }
              ) {
                items { code value }
              }
              image { url }
            }
            attributes { uid }
          }
        }
      }
    }
  }
`;
