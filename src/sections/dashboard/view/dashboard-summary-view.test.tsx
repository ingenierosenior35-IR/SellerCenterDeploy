import { render, screen } from '@testing-library/react';

import { DashboardSummaryView } from './dashboard-summary-view';

const mockUseSellerSummaryDashboard = jest.fn();

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <div data-testid="custom-breadcrumbs">{heading}</div>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid="iconify">{icon}</span>,
}));

jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label }: any) => <div data-testid={`date-picker-${label}`}>{label}</div>,
}));

jest.mock('src/hooks/dashboard/use-seller-summary-dashboard', () => ({
  useSellerSummaryDashboard: () => mockUseSellerSummaryDashboard(),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
    currentLang: 'es',
  }),
}));

describe('DashboardSummaryView', () => {
  beforeEach(() => {
    mockUseSellerSummaryDashboard.mockReturnValue({
      summary: {
        success: true,
        message: 'Summary retrieved successfully',
        data: {
          sales_account: { total_sales: 5769894.95, total_returns: 0 },
          orders_account: {
            created_orders: 47,
            pending_payment_orders: 47,
            pending_return_orders: 0,
            canceled_orders: 0,
            returned_orders: 0,
          },
          products_account: {
            created_products: 25,
            active_products: 25,
            inactive_products: 0,
            pending_approval_products: 0,
            out_of_stock_products: 1,
          },
          logistics_account: {
            pending_shipment_orders: 47,
            shipped_orders: 0,
            delivered_orders: 0,
          },
          reputation_account: {
            reviews_count: 3,
            stars_count: 93.33,
          },
        },
      },
      hasLiveData: true,
      isLoading: false,
      isError: false,
    });
  });

  it('renders home content wrapper', () => {
    render(<DashboardSummaryView />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders date filter controls', () => {
    render(<DashboardSummaryView />);
    expect(
      screen.getByTestId('date-picker-dashboardModule.summary.filters.initialDate')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('date-picker-dashboardModule.summary.filters.finalDate')
    ).toBeInTheDocument();
  });

  it('renders five summary cards', () => {
    render(<DashboardSummaryView />);
    const cards = [
      'dashboardModule.summary.cards.sales',
      'dashboardModule.summary.cards.orders',
      'dashboardModule.summary.cards.products',
      'dashboardModule.summary.cards.logistics',
      'dashboardModule.summary.cards.reputation',
    ];

    cards.forEach((cardName) => {
      expect(screen.getByRole('link', { name: cardName })).toBeInTheDocument();
    });
  });

  it('renders backend values when data is available', () => {
    render(<DashboardSummaryView />);
    expect(screen.getAllByText('$5,769,894.95').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('47').length).toBeGreaterThanOrEqual(2);
  });

  it('renders placeholders and upcoming labels when no live data', () => {
    mockUseSellerSummaryDashboard.mockReturnValueOnce({
      summary: {
        success: false,
        message: '',
        data: null,
      },
      hasLiveData: false,
      isLoading: false,
      isError: false,
    });

    render(<DashboardSummaryView />);

    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(5);
    expect(screen.getAllByText('dashboardModule.summary.upcoming').length).toBeGreaterThanOrEqual(5);
  });

  it('maps cards to expected routes', () => {
    render(<DashboardSummaryView />);

    expect(screen.getByRole('link', { name: 'dashboardModule.summary.cards.sales' })).toHaveAttribute(
      'href',
      '/order'
    );
    expect(screen.getByRole('link', { name: 'dashboardModule.summary.cards.orders' })).toHaveAttribute(
      'href',
      '/order'
    );
    expect(screen.getByRole('link', { name: 'dashboardModule.summary.cards.products' })).toHaveAttribute(
      'href',
      '/product'
    );
    expect(screen.getByRole('link', { name: 'dashboardModule.summary.cards.logistics' })).toHaveAttribute(
      'href',
      '/return'
    );
    expect(screen.getByRole('link', { name: 'dashboardModule.summary.cards.reputation' })).toHaveAttribute(
      'href',
      '/feedback'
    );
  });
});
