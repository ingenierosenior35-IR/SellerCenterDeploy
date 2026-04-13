import React from 'react';

import { renderWithTheme } from './_test.utils';
import CheckoutIllustration from './check-out-illustration';

describe('CheckoutIllustration', () => {
  it('renders svg with correct viewBox', () => {
    const { container } = renderWithTheme(
      <CheckoutIllustration data-testid="checkout-illustration" />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 200 200');
  });

  it('renders gradient id "a" used in illustration', () => {
    const { container } = renderWithTheme(<CheckoutIllustration />);
    expect(container.querySelector('linearGradient#a')).toBeInTheDocument();
  });

  it('forwards custom attributes', () => {
    const { getByTestId } = renderWithTheme(
      <CheckoutIllustration data-testid="checkout-illustration" aria-label="checkout-svg" />
    );

    expect(getByTestId('checkout-illustration')).toHaveAttribute('aria-label', 'checkout-svg');
  });
});
