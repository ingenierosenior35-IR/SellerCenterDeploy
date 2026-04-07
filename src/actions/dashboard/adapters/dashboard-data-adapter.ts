import type { DashboardData, SellerMetricsDashboard } from "src/interfaces/dashboard/dashboard";

export function dashboardDataAdapter(data:DashboardData): SellerMetricsDashboard {
  if (!data?.sellerMetricsDashboard) {
    return {
      message: '',
      success: false,
      data: []
    };
  }
  return data.sellerMetricsDashboard;
}