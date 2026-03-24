'use client';

import { gql } from 'graphql-request';

export const SELLER_PRODUCTS_QUERY = gql`
  query SellerProducts {
    sellerProducts(filter: {}) {
      items {
        name
        sku
        price_range {
          minimum_price {
            final_price {
              currency
              value
            }
            discount {
              amount_off
              percent_off
            }
            regular_price {
              currency
              value
            }
          }
        }
        categories {
          name
          uid
        }
        stock_saleable
        rating_summary
        stock_status
        id
        thumbnail {
          label
          url
        }
        custom_attributes_info(filters: { code: { in: ["name_en"] } }) {
          items {
            code
            value
          }
        }
      }
      page_info {
        current_page
        page_size
        total_pages
      }
      total_count
    }
  }
`;
