import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { CsvErrorsAlert } from './csv-errors-alert';

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const createFile = (name = 'test.csv') =>
  new File(['col1,col2\nval1,val2'], name, { type: 'text/csv' });

describe('CsvErrorsAlert', () => {
  it('renders nothing when csvFile is null', () => {
    const { container } = renderWithTheme(
      <CsvErrorsAlert csvFile={null} csvErrors={['error1']} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when csvErrors is empty', () => {
    const { container } = renderWithTheme(
      <CsvErrorsAlert csvFile={createFile()} csvErrors={[]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders alert when file and errors present', () => {
    renderWithTheme(
      <CsvErrorsAlert csvFile={createFile()} csvErrors={['Error row 1', 'Error row 2']} />
    );
    expect(screen.getByText('Errores en el archivo CSV:')).toBeInTheDocument();
  });

  it('renders error chip with correct count', () => {
    renderWithTheme(
      <CsvErrorsAlert csvFile={createFile()} csvErrors={['Error 1', 'Error 2', 'Error 3']} />
    );
    expect(screen.getByText('3 errores')).toBeInTheDocument();
  });

  it('opens dialog when chip is clicked', () => {
    renderWithTheme(
      <CsvErrorsAlert csvFile={createFile()} csvErrors={['Error row 1']} />
    );
    const chip = screen.getByRole('button', { name: /error/i });
    fireEvent.click(chip);
    expect(screen.getByText('Errores detectados en el archivo CSV')).toBeInTheDocument();
  });

  it('shows all errors in dialog', () => {
    renderWithTheme(
      <CsvErrorsAlert csvFile={createFile()} csvErrors={['Error A', 'Error B']} />
    );
    const chip = screen.getByRole('button', { name: /error/i });
    fireEvent.click(chip);
    expect(screen.getByText('Error A')).toBeInTheDocument();
    expect(screen.getByText('Error B')).toBeInTheDocument();
  });

  it('closes dialog when Cancel is clicked', () => {
    renderWithTheme(
      <CsvErrorsAlert csvFile={createFile()} csvErrors={['Error row 1']} />
    );
    const chip = screen.getByRole('button', { name: /error/i });
    fireEvent.click(chip);
    expect(screen.getByText('Errores detectados en el archivo CSV')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
  });
});
