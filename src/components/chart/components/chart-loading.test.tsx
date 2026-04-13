jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

import React from 'react';
import { render } from '@testing-library/react';

import { ChartLoading } from './chart-loading';

describe('ChartLoading', () => {
  it('renders loading skeleton', () => {
    render(<ChartLoading type="bar" />);
    const skeleton = document.querySelector('.MuiSkeleton-root');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders with className', () => {
    const { container } = render(<ChartLoading type="line" className="my-loading" />);
    expect(container.querySelector('.my-loading')).toBeInTheDocument();
  });

  it('renders for circular types', () => {
    render(<ChartLoading type="donut" />);
    const skeleton = document.querySelector('.MuiSkeleton-circular');
    expect(skeleton).toBeInTheDocument();
  });
});
