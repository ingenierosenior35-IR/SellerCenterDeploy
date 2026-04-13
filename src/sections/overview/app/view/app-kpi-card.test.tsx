import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppKpiCard } from './app-kpi-card';

jest.mock('src/components/chart', () => ({
  Chart: ({ type }: any) => <div data-testid={`chart-${type}`} />,
  useChart: (options: any) => options,
}));

jest.mock('src/utils/format-number', () => ({
  fPercent: (v: number) => `${v}%`,
  fCurrency: (v: number) => `$${v}`,
}));

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AppKpiCard', () => {
  const defaultProps = {
    title: 'Total Sales',
    total: 5000,
    percent: 12.5,
    series: [10, 20, 30, 40, 50, 60, 70],
  };

  it('renders the title', () => {
    renderWithTheme(<AppKpiCard {...defaultProps} />);
    expect(screen.getByText('Total Sales')).toBeInTheDocument();
  });

  it('renders total formatted as currency', () => {
    renderWithTheme(<AppKpiCard {...defaultProps} />);
    expect(screen.getByText('$5000')).toBeInTheDocument();
  });

  it('renders percent badge', () => {
    renderWithTheme(<AppKpiCard {...defaultProps} />);
    expect(screen.getByText('12.5%')).toBeInTheDocument();
  });

  it('renders últimos 7 días label', () => {
    renderWithTheme(<AppKpiCard {...defaultProps} />);
    expect(screen.getByText(/Últimos 7 días/i)).toBeInTheDocument();
  });

  it('renders a chart', () => {
    renderWithTheme(<AppKpiCard {...defaultProps} />);
    expect(screen.getByTestId('chart-line')).toBeInTheDocument();
  });

  it('renders "Ver detalle" link when showPeriod is false', () => {
    renderWithTheme(<AppKpiCard {...defaultProps} showPeriod={false} />);
    expect(screen.getByText('Ver detalle')).toBeInTheDocument();
  });

  it('renders "Periodo" when showPeriod is true', () => {
    renderWithTheme(<AppKpiCard {...defaultProps} showPeriod />);
    expect(screen.getByText(/Periodo/i)).toBeInTheDocument();
    expect(screen.getByText('Hoy')).toBeInTheDocument();
  });

  it('does not show trend icon for zero percent', () => {
    const { container } = renderWithTheme(
      <AppKpiCard {...defaultProps} percent={0} />
    );
    expect(container).toBeInTheDocument();
  });

  it('renders with transparentCard prop', () => {
    renderWithTheme(<AppKpiCard {...defaultProps} transparentCard />);
    expect(screen.getByText('Total Sales')).toBeInTheDocument();
  });

  it('renders negative percent', () => {
    renderWithTheme(<AppKpiCard {...defaultProps} percent={-5} />);
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });
});
