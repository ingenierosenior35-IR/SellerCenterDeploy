import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import Footer from './footer';
import Benefits from './benefits';
import Features from './features';
import WhyCards from './why-cards';
import HowItWorks from './how-it-works';
import MiddlePanel from './middle-panel';
import StartSelling from './start-selling';

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
  it('renders address section with Spanish label', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText('Dirección')).toBeInTheDocument();
  });

  it('renders contact section with Spanish label', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText('Contactanos')).toBeInTheDocument();
  });

  it('renders Colombian address', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText(/NY 10002 Colombia/i)).toBeInTheDocument();
  });

  it('renders Colombian phone number', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText(/\+57 310 784 5 789/i)).toBeInTheDocument();
  });

  it('renders correct email', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText(/info@mitimit\.com/i)).toBeInTheDocument();
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

