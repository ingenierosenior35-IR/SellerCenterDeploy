import React from 'react';

import { renderWithTheme } from './_test.utils';
import CheckInIllustration from './check-in-illustration';

describe('CheckInIllustration', () => {
  it('renders svg icon with expected viewBox', () => {
    const { container } = renderWithTheme(
      <CheckInIllustration data-testid="checkin-illustration" />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 200 200');
  });

  it('contains gradient definitions used by paths', () => {
    const { container } = renderWithTheme(<CheckInIllustration />);
    expect(container.querySelector('linearGradient#a')).toBeInTheDocument();
    expect(container.querySelector('linearGradient#b')).toBeInTheDocument();
  });

  it('accepts and forwards arbitrary props', () => {
    const { getByTestId } = renderWithTheme(
      <CheckInIllustration data-testid="checkin-illustration" role="img" />
    );

    expect(getByTestId('checkin-illustration')).toHaveAttribute('role', 'img');
  });
});
