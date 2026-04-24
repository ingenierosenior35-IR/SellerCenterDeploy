export interface SellerSummaryDashboardResponse {
  sellerSummaryDashboard?: SellerSummaryDashboardPayload;
}

export interface SellerSummaryDashboardPayload {
  success: boolean;
  message: string;
  data: SellerSummaryDashboardData | null;
}

export interface SellerSummaryDashboardData {
  sales_account: SalesAccount;
  orders_account: OrdersAccount;
  products_account: ProductsAccount;
  logistics_account: LogisticsAccount;
  reputation_account: ReputationAccount;
}

export interface SalesAccount {
  total_sales: number;
  total_returns: number;
}

export interface OrdersAccount {
  created_orders: number;
  pending_payment_orders: number;
  pending_return_orders: number;
  canceled_orders: number;
  returned_orders: number;
}

export interface ProductsAccount {
  created_products: number;
  active_products: number;
  inactive_products: number;
  pending_approval_products: number;
  out_of_stock_products: number;
}

export interface LogisticsAccount {
  pending_shipment_orders: number;
  shipped_orders: number;
  delivered_orders: number;
}

export interface ReputationAccount {
  reviews_count: number;
  stars_count: number;
}
