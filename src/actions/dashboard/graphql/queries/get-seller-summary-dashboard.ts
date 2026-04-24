import { gql } from 'graphql-request';

export const GET_SELLER_SUMMARY_DASHBOARD_QUERY = gql`
  query SellerSummaryDashboard($fromDate: String!, $toDate: String!) {
    sellerSummaryDashboard(from_date: $fromDate, to_date: $toDate) {
      success
      message
      data {
        sales_account {
          total_sales
          total_returns
        }
        orders_account {
          created_orders
          pending_payment_orders
          pending_return_orders
          canceled_orders
          returned_orders
        }
        products_account {
          created_products
          active_products
          inactive_products
          pending_approval_products
          out_of_stock_products
        }
        logistics_account {
          pending_shipment_orders
          shipped_orders
          delivered_orders
        }
        reputation_account {
          reviews_count
          stars_count
        }
      }
    }
  }
`;
