import { render, screen } from '@testing-library/react';

import { OverviewAppView } from './overview-app-view';

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (ns: string, key?: string) => (key ? `${ns}.${key}` : ns),
    currentLang: 'es',
  }),
}));

jest.mock('src/_mock', () => ({
  _appInvoices: [],
  _appProducts: [],
  _appCustomers: [],
}));

jest.mock('./app-kpi-card', () => ({
  AppKpiCard: ({ title }: any) => <div data-testid="kpi-card">{title}</div>,
}));

jest.mock('../app-top-products', () => ({
  AppTopProducts: ({ title }: any) => <div data-testid="top-products">{title}</div>,
}));

jest.mock('../app-new-invoices', () => ({
  AppNewInvoices: ({ title }: any) => <div data-testid="new-invoices">{title}</div>,
}));

jest.mock('../app-top-customers', () => ({
  AppTopCustomers: ({ title }: any) => <div data-testid="top-customers">{title}</div>,
}));

describe('OverviewAppView', () => {
  it('renders home content wrapper', () => {
    render(<OverviewAppView />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders three KPI cards', () => {
    render(<OverviewAppView />);
    const kpiCards = screen.getAllByTestId('kpi-card');
    expect(kpiCards).toHaveLength(3);
  });

  it('renders Net Profit KPI card', () => {
    render(<OverviewAppView />);
    const cards = screen.getAllByTestId('kpi-card');
    const titles = cards.map((c) => c.textContent);
    expect(titles).toContain('Net Profit');
  });

  it('renders Total Sales KPI card', () => {
    render(<OverviewAppView />);
    const cards = screen.getAllByTestId('kpi-card');
    const titles = cards.map((c) => c.textContent);
    expect(titles).toContain('Total Sales');
  });

  it('renders new invoices table', () => {
    render(<OverviewAppView />);
    expect(screen.getByTestId('new-invoices')).toBeInTheDocument();
  });

  it('renders top products section', () => {
    render(<OverviewAppView />);
    expect(screen.getByTestId('top-products')).toBeInTheDocument();
  });

  it('renders top customers section', () => {
    render(<OverviewAppView />);
    expect(screen.getByTestId('top-customers')).toBeInTheDocument();
  });
});
