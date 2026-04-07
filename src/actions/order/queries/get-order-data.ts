'use client';

import { gql } from 'graphql-request';

export const GET_ORDERS = gql`
  query GetSellerOrders($page_size: Int!, $current_page: Int!) {
    sellerOrders(pageSize: $page_size, currentPage: $current_page) {
      total_count
      user_message
      items {
        status
        created_at
        total {
          grand_total {
            value
          }
          base_grand_total {
            value
          }
          pending_balance {
            value
          }
          shipping_handling {
            amount_excluding_tax {
              value
            }
            amount_including_tax {
              value
            }
            discounts {
              amount {
                value
              }
            }
            taxes {
              rate
              title
            }
            total_amount {
              value
            }
          }
          subtotal {
            value
          }
          subtotal_excl_tax {
            value
          }
          subtotal_incl_tax {
            value
          }
          total_shipping {
            value
          }
          total_tax {
            value
          }
          total_store_credit {
            value
          }
        }
        items {
          product_sku
          quantity_ordered
          product_image
          product_sale_price {
            value
          }
          row_total
          product_name
          quantity_invoiced
        }
        order_number
        payment_methods {
          name
          type
        }
        email
        customer_info {
          firstname
          lastname
        }
        grand_total
      }
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
`;

export const GET_ORDER_DETAIL = gql`
  query GetSellerOrders($increment_id: String!) {
    sellerOrders(increment_id: $increment_id) {
      total_count
      user_message
      items {
        status
        total {
          grand_total {
            value
          }
          base_grand_total {
            value
          }
          pending_balance {
            value
          }
          shipping_handling {
            amount_excluding_tax {
              value
            }
            amount_including_tax {
              value
            }
            discounts {
              amount {
                value
              }
            }
            taxes {
              rate
              title
            }
            total_amount {
              value
            }
          }
          subtotal {
            value
          }
          subtotal_excl_tax {
            value
          }
          subtotal_incl_tax {
            value
          }
          total_shipping {
            value
          }
          total_tax {
            value
          }
          total_store_credit {
            value
          }
        }
        items {
          product_sku
          quantity_ordered
          product_image
          product_sale_price {
            value
          }
          product_name
          quantity_invoiced
          selected_options {
            label
            value
          }
        }
        order_number
        payment_methods {
          name
          type
        }
        email
        customer_info {
          firstname
          lastname
        }
        grand_total
        order_date
        shipping_address {
          city
          firstname
          lastname
          postcode
          prefix
          region
          street
          suffix
          telephone
        }
        order_track_number
        shipping_method
        shippingDate
        billing_address {
          city
          firstname
          lastname
          postcode
          prefix
          region
          street
          suffix
          telephone
        }
      }
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
`;
