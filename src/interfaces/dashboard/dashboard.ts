export interface ResponseDashboardData {
  data: DashboardData
}

export interface DashboardData {
  sellerMetricsDashboard: SellerMetricsDashboard
}

export interface SellerMetricsDashboard {
  message: string
  success: boolean
  data: Daum[]
}

export interface Daum {
  average_order_value: AverageOrderValue
  top_sale_products: TopSaleProduct[]
  top_customers: TopCustomer[]
  total_sales: TotalSales
  orders_over_time: OrdersOverTime
}

export interface AverageOrderValue {
  avg_order_value: string
  avg_order_value_formatted: string
  graph_data: string[]
  graph_x_value: string[]
}

export interface TopSaleProduct {
  image_url: string
  name: string
  qty: number
  url: string
}

export interface TopCustomer {
  billing_full: string
  billing_telephone?: string
  customer_base_total: string
  email: string
  name: string
  order_count: number
}

export interface TotalSales {
  commission_paid: string
  graph_data: string[]
  graph_x_value: string[]
  remaining_payout: string
  total_payout: string
  total_sale: string
  total_sale_amount: string
}

export interface OrdersOverTime {
  graph_data: string[]
  graph_x_value: string[]
}
