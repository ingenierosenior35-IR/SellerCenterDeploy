jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

import React from 'react';
import { render } from '@testing-library/react';

import { SvgColor } from './svg-color';

describe('SvgColor', () => {
  it('renders a span element', () => {
    const { container } = render(<SvgColor src="/icon.svg" />);
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
  });

  it('applies mask style with provided src', () => {
    const { container } = render(<SvgColor src="/my-icon.svg" />);
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
  });

  it('applies additional className', () => {
    const { container } = render(<SvgColor src="/icon.svg" className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
