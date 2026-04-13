import React from 'react';

import { renderWithTheme } from './_test.utils';
import BookingIllustration from './booking-illustration';

describe('BookingIllustration', () => {
  it('renders svg icon with default viewBox', () => {
    const { container } = renderWithTheme(
      <BookingIllustration data-testid="booking-illustration" />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 200 200');
  });

  it('forwards extra props to SvgIcon root', () => {
    const { getByTestId } = renderWithTheme(
      <BookingIllustration data-testid="booking-illustration" className="custom-class" />
    );

    expect(getByTestId('booking-illustration')).toHaveClass('custom-class');
  });

  it('renders internal mask ids used by illustration', () => {
    const { container } = renderWithTheme(<BookingIllustration />);
    expect(container.querySelector('mask#mask0')).toBeInTheDocument();
    expect(container.querySelector('mask#mask1')).toBeInTheDocument();
    expect(container.querySelector('mask#mask2')).toBeInTheDocument();
  });
});
