import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import CustomTable from './custom-table';

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('CustomTable', () => {
  it('renders a table', () => {
    renderWithTheme(<CustomTable />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders a search text field', () => {
    renderWithTheme(<CustomTable />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders data rows', () => {
    renderWithTheme(<CustomTable />);
    expect(screen.getByText('Frozen yoghurt')).toBeInTheDocument();
    expect(screen.getByText('Ice cream sandwich')).toBeInTheDocument();
  });

  it('renders pagination', () => {
    renderWithTheme(<CustomTable />);
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('renders table head with sort labels', () => {
    renderWithTheme(<CustomTable />);
    const columnHeaders = screen.getAllByRole('columnheader');
    expect(columnHeaders.length).toBeGreaterThan(0);
  });
});
