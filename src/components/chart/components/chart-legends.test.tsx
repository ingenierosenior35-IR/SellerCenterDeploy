jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { ChartLegends } from './chart-legends';

describe('ChartLegends', () => {
  const labels = ['Series A', 'Series B', 'Series C'];
  const colors = ['#FF0000', '#00FF00', '#0000FF'];

  it('renders labels', () => {
    render(<ChartLegends labels={labels} colors={colors} />);
    expect(screen.getByText('Series A')).toBeInTheDocument();
    expect(screen.getByText('Series B')).toBeInTheDocument();
    expect(screen.getByText('Series C')).toBeInTheDocument();
  });

  it('renders values when provided', () => {
    render(<ChartLegends labels={labels} values={['100', '200', '300']} />);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('renders sublabels when provided', () => {
    render(<ChartLegends labels={['A']} sublabels={['Jan']} />);
    expect(screen.getByText(/\(Jan\)/)).toBeInTheDocument();
  });

  it('renders empty list when no labels', () => {
    const { container } = render(<ChartLegends />);
    expect(container.querySelector('ul')).toBeInTheDocument();
  });
});
