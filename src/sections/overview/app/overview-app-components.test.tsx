import React from 'react';
import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppWelcome } from './app-welcome';
import { AppTopProducts } from './app-top-products';
import { AppWidgetSummary } from './app-widget-summary';

jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '' },
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/chart', () => ({
  Chart: () => <div data-testid="chart" />,
  useChart: () => ({}),
}));

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.5)',
}));

const theme = createTheme({ cssVariables: true } as any);
// ✅ parche necesario para app-welcome
(theme as any).mixins = {
  ...(theme as any).mixins,
  bgGradient: ({ images }: any) => ({ backgroundImage: Array.isArray(images) ? images.join(',') : images }),
};

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AppWelcome', () => {
  it('renders title', () => {
    renderWithTheme(<AppWelcome title="Welcome back!" />);
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    renderWithTheme(<AppWelcome description="Your dashboard summary" />);
    expect(screen.getByText('Your dashboard summary')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    renderWithTheme(<AppWelcome action={<button>Go to dashboard</button>} />);
    expect(screen.getByRole('button', { name: 'Go to dashboard' })).toBeInTheDocument();
  });

  it('renders without crashing when no props given', () => {
    const { container } = renderWithTheme(<AppWelcome />);
    expect(container).toBeInTheDocument();
  });
});

describe('AppTopProducts', () => {
  const list = [
    { id: '1', name: 'Product A', image: '/img-a.jpg', totalFavorites: 100 },
    { id: '2', name: 'Product B', image: '/img-b.jpg', totalFavorites: 50 },
  ];

  it('renders title', () => {
    renderWithTheme(<AppTopProducts title="Top Products" list={list} />);
    expect(screen.getByText('Top Products')).toBeInTheDocument();
  });

  it('renders all product names', () => {
    renderWithTheme(<AppTopProducts title="Top" list={list} />);
    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
  });
});

describe('AppWidgetSummary', () => {
  const defaultProps = {
    title: 'Total Sales',
    total: 12345,
    percent: 5.2,
    chart: {
      categories: ['Jan', 'Feb', 'Mar'],
      series: [10, 20, 30],
    },
  };

  it('renders title', () => {
    renderWithTheme(<AppWidgetSummary {...defaultProps} />);
    expect(screen.getByText('Total Sales')).toBeInTheDocument();
  });

  it('renders chart', () => {
    renderWithTheme(<AppWidgetSummary {...defaultProps} />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });
});
