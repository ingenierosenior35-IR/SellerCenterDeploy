import type {
  TotalSales,
  TopSaleProduct,
  OrdersOverTime,
  AverageOrderValue,
} from 'src/interfaces/dashboard/dashboard';

import { useMemo } from 'react';

import { useGetDashboardData } from 'src/actions/dashboard/use-get-dashboard-data';

interface ItemProps {
  readonly id: string;
  readonly name: string;
  readonly image: string;
  readonly totalFavorites: number;
}
interface ItemCustomerProps {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}
export function useDashboardData() {
  const { returns, isLoading } = useGetDashboardData();
  const dashboardData = useMemo(
    () => (Array.isArray(returns?.data) ? returns.data : []),
    [returns]
  );
  
console.log('isLoading', isLoading);
  let topProducts: ItemProps[] = [];
  let topCustomers: ItemCustomerProps[] = [];
  let averageOrderValue: AverageOrderValue = {
    avg_order_value: '0',
    avg_order_value_formatted: '0',
    graph_data: [],
    graph_x_value: [],
  };
  let totalSales: TotalSales = {
    commission_paid: '0',
    graph_data: [],
    graph_x_value: [],
    remaining_payout: '0',
    total_payout: '0',
    total_sale: '0',
    total_sale_amount: '0',
  };
  let ordersOverTime: OrdersOverTime = {
    graph_data: [],
    graph_x_value: [],
  };

  dashboardData.forEach((item) => {
    if (item.top_sale_products) {
      topProducts = item.top_sale_products.map((product: TopSaleProduct, index: number) => ({
        id: (index + 1).toString(),
        name: product.name,
        image: product.image_url,
        totalFavorites: product.qty,
      }));
    }
    if (item.top_customers) {
      topCustomers = item.top_customers.map((customer: any, index: number) => ({
        id: (index + 1).toString(),
        name: customer.name,
        email: customer.email,
      }));
    }
    if (item.average_order_value) {
      averageOrderValue = item.average_order_value;
    }
    if (item.total_sales) {
      totalSales = item.total_sales;
    }
    if (item.orders_over_time) {
      ordersOverTime = item.orders_over_time;
    }
  });

  return {
    dashboardData,
    topProducts,
    topCustomers,
    averageOrderValue,
    totalSales,
    ordersOverTime,
    isLoading
  };
}
