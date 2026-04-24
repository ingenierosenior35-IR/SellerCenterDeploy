import { sellerSummaryDashboardAdapter } from './seller-summary-dashboard-adapter';

describe('sellerSummaryDashboardAdapter', () => {
  it('returns empty summary payload when source data is undefined', () => {
    const result = sellerSummaryDashboardAdapter();

    expect(result).toMatchObject({
      success: false,
      message: '',
      data: {
        sales_account: { total_sales: 0, total_returns: 0 },
        orders_account: {
          created_orders: 0,
          pending_payment_orders: 0,
          pending_return_orders: 0,
          canceled_orders: 0,
          returned_orders: 0,
        },
      },
    });
  });

  it('returns provided summary payload when data is present', () => {
    const source = {
      sellerSummaryDashboard: {
        success: true,
        message: 'ok',
        data: {
          sales_account: { total_sales: 10, total_returns: 1 },
          orders_account: {
            created_orders: 2,
            pending_payment_orders: 3,
            pending_return_orders: 4,
            canceled_orders: 5,
            returned_orders: 6,
          },
          products_account: {
            created_products: 7,
            active_products: 8,
            inactive_products: 9,
            pending_approval_products: 10,
            out_of_stock_products: 11,
          },
          logistics_account: {
            pending_shipment_orders: 12,
            shipped_orders: 13,
            delivered_orders: 14,
          },
          reputation_account: {
            reviews_count: 15,
            stars_count: 16,
          },
        },
      },
    };

    const result = sellerSummaryDashboardAdapter(source as any);

    expect(result).toEqual(source.sellerSummaryDashboard);
  });

  it('fills empty data object when payload exists but data is null', () => {
    const result = sellerSummaryDashboardAdapter({
      sellerSummaryDashboard: {
        success: true,
        message: 'ok',
        data: null,
      },
    } as any);

    expect(result.success).toBe(true);
    expect(result.message).toBe('ok');
    expect(result.data?.sales_account.total_sales).toBe(0);
    expect(result.data?.reputation_account.stars_count).toBe(0);
  });
});
