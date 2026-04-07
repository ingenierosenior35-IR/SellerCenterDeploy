import { gql } from 'graphql-request';

export const GET_DASHBOARD_DATA_QUERY = gql`
  query SellerMetricsDashboard($fromDate: String!, $toDate: String!) {
    sellerMetricsDashboard(from_date: $fromDate, to_date: $toDate) {
      message
      success
      data {
        average_order_value {
          avg_order_value
          avg_order_value_formatted
          graph_data
          graph_x_value
        }
        top_sale_products {
          image_url
          name
          qty
          url
        }
        top_customers {
          billing_full
          billing_telephone
          customer_base_total
          email
          name
          order_count
        }
        total_sales {
          commission_paid
          graph_data
          graph_x_value
          remaining_payout
          total_payout
          total_sale
          total_sale_amount
        }
        orders_over_time {
          graph_data
          graph_x_value
        }
        top_sale_categories {
          category
          id
          percentage
        }
        order_status_counts {
          all
          canceled
          closed
          complete
          pending
          processing
        }
      }
    }
  }
`;
