jest.mock('react-apexcharts', () => ({
  __esModule: true,
  default: () => <div data-testid="apex-chart" />,
}));
jest.mock('./components', () => ({
  ChartLoading: ({ type }: { type: string }) => <div data-testid={`chart-loading-${type}`} />,
}));
jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

import React from 'react';
import { render } from '@testing-library/react';

import { Chart } from './chart';

describe('Chart', () => {
  it('renders chart root element', () => {
    const { container } = render(<Chart type="bar" series={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with className', () => {
    const { container } = render(<Chart type="line" series={[]} className="my-chart" />);
    expect(container.querySelector('.my-chart')).toBeInTheDocument();
  });
});
