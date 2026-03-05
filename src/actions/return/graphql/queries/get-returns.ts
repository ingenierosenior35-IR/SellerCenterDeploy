import { gql } from 'graphql-request';

export const GET_RETURNS_QUERY = gql`
query getReturns {
    customer {
        returns {
            total_count
            items {
                number
                status
                total_refunded_amount
                uid
                items {
                    status
                    uid
                    quantity
                    order_item {
                        id
                        product_image
                        product_name
                        product_sku
                    }
                }
                customer {
                    email
                    firstname
                    lastname
                }
                order {
                  order_number
                }
                created_at
            }
            page_info {
                current_page
                page_size
                total_pages
            }
        }
    }
}
`;
