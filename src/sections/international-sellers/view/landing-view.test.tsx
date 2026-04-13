import { render, screen } from '@testing-library/react';

import { LandingView } from './landing-view';

jest.mock('src/sections/international-sellers/components/Hero', () => ({
  __esModule: true,
  default: () => <div data-testid="hero-section" />,
}));

jest.mock('src/sections/international-sellers/components/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer-section" />,
}));

jest.mock('src/sections/international-sellers/components/CTAForm', () => ({
  __esModule: true,
  default: () => <div data-testid="cta-form-section" />,
}));

jest.mock('src/sections/international-sellers/components/Features', () => ({
  __esModule: true,
  default: () => <div data-testid="features-section" />,
}));

jest.mock('src/sections/international-sellers/components/WhyCards', () => ({
  __esModule: true,
  default: () => <div data-testid="why-cards-section" />,
}));

jest.mock('src/sections/international-sellers/components/HowItWorks', () => ({
  __esModule: true,
  default: () => <div data-testid="how-it-works-section" />,
}));

jest.mock('src/sections/international-sellers/components/MiddlePanel', () => ({
  __esModule: true,
  default: () => <div data-testid="middle-panel-section" />,
}));

jest.mock('src/sections/international-sellers/components/StartSelling', () => ({
  __esModule: true,
  default: () => <div data-testid="start-selling-section" />,
}));

describe('LandingView', () => {
  it('renders all eight landing sections', () => {
    render(<LandingView />);
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('footer-section')).toBeInTheDocument();
    expect(screen.getByTestId('cta-form-section')).toBeInTheDocument();
    expect(screen.getByTestId('features-section')).toBeInTheDocument();
    expect(screen.getByTestId('why-cards-section')).toBeInTheDocument();
    expect(screen.getByTestId('how-it-works-section')).toBeInTheDocument();
    expect(screen.getByTestId('middle-panel-section')).toBeInTheDocument();
    expect(screen.getByTestId('start-selling-section')).toBeInTheDocument();
  });

  it('has a root element in the document', () => {
    const { container } = render(<LandingView />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
