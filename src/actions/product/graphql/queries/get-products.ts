import { gql } from 'graphql-request';

export const GET_PRODUCTS_QUERY = gql`
query getProducts {
    products (filter: {}) {
        items {
            id
            sku
            name
            thumbnail {
                url
            }
            categories {
                uid
                name
            }
            price_range {
                minimum_price {
                    regular_price {
                        value
                    }
                    final_price {
                        value
                    }
                    discount {
                        amount_off
                        percent_off
                    }
                }
            }
            stock_saleable
            stock_status
            rating_summary
        }
    }
}
`;
