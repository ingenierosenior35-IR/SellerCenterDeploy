import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { toast } from 'src/components/snackbar';

import CTAForm from './CTAForm';

jest.mock('src/components/snackbar', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

global.fetch = jest.fn();

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('CTAForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders name input field', () => {
    renderWithTheme(<CTAForm />);
    expect(screen.getByLabelText(/name/i) || screen.getAllByRole('textbox')[0]).toBeInTheDocument();
  });

  it('renders at least one text field', () => {
    renderWithTheme(<CTAForm />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('renders the submit button', () => {
    renderWithTheme(<CTAForm />);
    expect(screen.getByRole('button', { name: /send|submit|enviar|contact|solicitar/i })).toBeInTheDocument();
  });

  it('renders the checkbox for consent', () => {
    renderWithTheme(<CTAForm />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('calls toast.error when submitting without required fields', async () => {
    renderWithTheme(<CTAForm />);
    const submitBtn = screen.getByRole('button', { name: /send|submit|enviar|contact|solicitar/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('calls toast.error when consent not accepted', async () => {
    renderWithTheme(<CTAForm />);
    // Fill required fields
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'John' } });
    fireEvent.change(inputs[1], { target: { value: 'john@test.com' } });

    const submitBtn = screen.getByRole('button', { name: /send|submit|enviar|contact|solicitar/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
