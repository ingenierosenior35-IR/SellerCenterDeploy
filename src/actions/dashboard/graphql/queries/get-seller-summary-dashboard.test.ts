import { GET_SELLER_SUMMARY_DASHBOARD_QUERY } from './get-seller-summary-dashboard';

describe('get-seller-summary-dashboard graphql query', () => {
  it('is a non-empty string', () => {
    expect(typeof GET_SELLER_SUMMARY_DASHBOARD_QUERY).toBe('string');
    expect(GET_SELLER_SUMMARY_DASHBOARD_QUERY.length).toBeGreaterThan(0);
  });

  it('contains sellerSummaryDashboard query and variables', () => {
    expect(GET_SELLER_SUMMARY_DASHBOARD_QUERY).toContain('query SellerSummaryDashboard');
    expect(GET_SELLER_SUMMARY_DASHBOARD_QUERY).toContain('$fromDate: String!');
    expect(GET_SELLER_SUMMARY_DASHBOARD_QUERY).toContain('$toDate: String!');
    expect(GET_SELLER_SUMMARY_DASHBOARD_QUERY).toContain('sellerSummaryDashboard(from_date: $fromDate, to_date: $toDate)');
  });

  it('contains required account sections', () => {
    expect(GET_SELLER_SUMMARY_DASHBOARD_QUERY).toContain('sales_account');
    expect(GET_SELLER_SUMMARY_DASHBOARD_QUERY).toContain('orders_account');
    expect(GET_SELLER_SUMMARY_DASHBOARD_QUERY).toContain('products_account');
    expect(GET_SELLER_SUMMARY_DASHBOARD_QUERY).toContain('logistics_account');
    expect(GET_SELLER_SUMMARY_DASHBOARD_QUERY).toContain('reputation_account');
  });
});
