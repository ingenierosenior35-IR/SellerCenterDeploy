import { gql } from 'graphql-request';

export const GET_PRODUCTS_QUERY = gql`
query getProducts {
    products (filter: {}) {
        items {
            id
            name
            sku
            price_range {
                minimum_price {
                    regular_price {
                        value
                        currency
                    }
                }
            }
            image {
                url
            }
        }
    }
}
`;
