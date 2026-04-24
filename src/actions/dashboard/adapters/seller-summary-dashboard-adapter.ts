import type {
  SellerSummaryDashboardData,
  SellerSummaryDashboardPayload,
  SellerSummaryDashboardResponse,
} from 'src/interfaces/dashboard/seller-summary-dashboard';

const EMPTY_SUMMARY_DATA: SellerSummaryDashboardData = {
  sales_account: {
    total_sales: 0,
    total_returns: 0,
  },
  orders_account: {
    created_orders: 0,
    pending_payment_orders: 0,
    pending_return_orders: 0,
    canceled_orders: 0,
    returned_orders: 0,
  },
  products_account: {
    created_products: 0,
    active_products: 0,
    inactive_products: 0,
    pending_approval_products: 0,
    out_of_stock_products: 0,
  },
  logistics_account: {
    pending_shipment_orders: 0,
    shipped_orders: 0,
    delivered_orders: 0,
  },
  reputation_account: {
    reviews_count: 0,
    stars_count: 0,
  },
};

export function sellerSummaryDashboardAdapter(
  data?: SellerSummaryDashboardResponse
): SellerSummaryDashboardPayload {
  if (!data?.sellerSummaryDashboard) {
    return {
      success: false,
      message: '',
      data: EMPTY_SUMMARY_DATA,
    };
  }

  return {
    ...data.sellerSummaryDashboard,
    data: data.sellerSummaryDashboard.data ?? EMPTY_SUMMARY_DATA,
  };
}
