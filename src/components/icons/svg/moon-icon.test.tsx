import React from 'react';
import { render, screen } from '@testing-library/react';

import { MoonIcon } from './moon-icon';

describe('MoonIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<MoonIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders with default dimensions', () => {
    const { container } = render(<MoonIcon />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('16');
    expect(svg?.getAttribute('height')).toBe('16');
  });

  it('accepts custom props', () => {
    render(<MoonIcon data-testid="moon-icon" />);
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });
});
