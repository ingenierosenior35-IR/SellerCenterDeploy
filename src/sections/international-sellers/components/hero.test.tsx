import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { toast } from 'src/components/snackbar';

import Hero from './hero';

jest.mock('src/components/snackbar', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

global.fetch = jest.fn();

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Hero', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the MITI-MITI logo', () => {
    renderWithTheme(<Hero />);
    const logo = screen.getByAltText(/MITI/i);
    expect(logo).toBeInTheDocument();
  });

  it('renders the Login link', () => {
    renderWithTheme(<Hero />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('renders the main heading', () => {
    renderWithTheme(<Hero />);
    expect(screen.getByText(/Sell Your Products in Colombia/i)).toBeInTheDocument();
  });

  it('renders the description text', () => {
    renderWithTheme(<Hero />);
    expect(screen.getByText(/supplier based in Mainland China/i)).toBeInTheDocument();
  });

  it('renders the focus tagline above the form', () => {
    renderWithTheme(<Hero />);
    expect(screen.getByText(/Focus on your products\. We handle the rest\./i)).toBeInTheDocument();
  });

  it('renders Name, E-mail and Cellphone inputs', () => {
    renderWithTheme(<Hero />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(3);
  });

  it('renders the consent checkbox', () => {
    renderWithTheme(<Hero />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders the Submit button', () => {
    renderWithTheme(<Hero />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows toast.error when submitting with empty Name and Email', async () => {
    renderWithTheme(<Hero />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('shows toast.error when consent is not accepted', async () => {
    renderWithTheme(<Hero />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'John' } });
    fireEvent.change(inputs[1], { target: { value: 'john@test.com' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('shows toast.success and resets form on successful submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    renderWithTheme(<Hero />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'John' } });
    fireEvent.change(inputs[1], { target: { value: 'john@test.com' } });
    fireEvent.change(inputs[2], { target: { value: '3001234567' } });
    fireEvent.click(screen.getByRole('checkbox'));

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('shows toast.error when fetch returns not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    renderWithTheme(<Hero />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'John' } });
    fireEvent.change(inputs[1], { target: { value: 'john@test.com' } });
    fireEvent.click(screen.getByRole('checkbox'));

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error en envío');
    });
  });

  it('shows fallback error message when fetch throws without a message', async () => {
    // Throwing null means err?.message is undefined → triggers the ?? branch
    (global.fetch as jest.Mock).mockRejectedValueOnce(null);

    renderWithTheme(<Hero />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'John' } });
    fireEvent.change(inputs[1], { target: { value: 'john@test.com' } });
    fireEvent.click(screen.getByRole('checkbox'));

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se pudo enviar');
    });
  });
});
