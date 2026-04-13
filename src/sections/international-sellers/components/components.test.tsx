import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import Footer from './Footer';
import Benefits from './Benefits';
import Features from './Features';
import WhyCards from './WhyCards';
import HowItWorks from './HowItWorks';
import MiddlePanel from './MiddlePanel';
import StartSelling from './StartSelling';

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Benefits', () => {
  it('renders all benefit cards', () => {
    renderWithTheme(<Benefits />);
    expect(screen.getByText('No local entity required')).toBeInTheDocument();
    expect(screen.getByText('We manage customs')).toBeInTheDocument();
    expect(screen.getByText('Local fulfillment')).toBeInTheDocument();
    expect(screen.getByText('Customer support')).toBeInTheDocument();
  });
});

describe('Features', () => {
  it('renders feature items', () => {
    renderWithTheme(<Features />);
    expect(screen.getByText('Direct Access To The Colombian Market')).toBeInTheDocument();
    expect(
      screen.getByText('No need to manage customs, imports, or local logistics')
    ).toBeInTheDocument();
    expect(
      screen.getByText('End-to-end order fulfillment handled by MITI-MITI®')
    ).toBeInTheDocument();
  });
});

describe('WhyCards', () => {
  it('renders why-card items', () => {
    renderWithTheme(<WhyCards />);
    expect(screen.getByText(/Enter The Colombian/i)).toBeInTheDocument();
    expect(screen.getByText(/Eliminate Operational/i)).toBeInTheDocument();
    expect(screen.getByText(/Reach Colombian End/i)).toBeInTheDocument();
    expect(screen.getByText(/Scale Your Sales Volume/i)).toBeInTheDocument();
  });
});

describe('HowItWorks', () => {
  it('renders steps', () => {
    renderWithTheme(<HowItWorks />);
    expect(screen.getByText(/Register as/i)).toBeInTheDocument();
    expect(screen.getByText(/We sell in/i)).toBeInTheDocument();
    expect(screen.getByText(/We deliver to/i)).toBeInTheDocument();
  });

  it('renders step descriptions', () => {
    renderWithTheme(<HowItWorks />);
    expect(screen.getByText(/Submit your company information/i)).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('renders address section', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  it('renders contact us section', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText('Contact us')).toBeInTheDocument();
  });

  it('renders terms link', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText('Términos y condiciones')).toBeInTheDocument();
  });
});

describe('MiddlePanel', () => {
  it('renders "You Sell" text', () => {
    renderWithTheme(<MiddlePanel />);
    expect(screen.getByText(/You Sell/i)).toBeInTheDocument();
  });

  it('renders "MITI-MITI Manages" text', () => {
    renderWithTheme(<MiddlePanel />);
    expect(screen.getByText(/MITI‑MITI® Manages/i)).toBeInTheDocument();
  });
});

describe('StartSelling', () => {
  it('renders start selling heading', () => {
    renderWithTheme(<StartSelling />);
    expect(screen.getByText(/START SELLING/i)).toBeInTheDocument();
  });
});

