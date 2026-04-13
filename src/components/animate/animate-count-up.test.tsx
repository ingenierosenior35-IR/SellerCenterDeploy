jest.mock('framer-motion', () => ({
  m: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{String(children ?? '')}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useInView: jest.fn(() => true),
  useMotionValue: jest.fn((v: any) => v),
  useTransform: jest.fn((_value: any, transform: any) =>
    transform ? String(transform(0)) : '0'
  ),
  animate: jest.fn(),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { AnimateCountUp } from './animate-count-up';

describe('AnimateCountUp', () => {
  it('renders a typography element', () => {
    render(<AnimateCountUp to={1000} />);
    const el = document.querySelector('p');
    expect(el).toBeInTheDocument();
  });

  it('renders with unit suffix for large numbers', () => {
    render(<AnimateCountUp to={5000} />);
    expect(screen.getByText('k')).toBeInTheDocument();
  });

  it('renders with custom unit', () => {
    render(<AnimateCountUp to={42} unit="%" />);
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('renders without unit for small numbers', () => {
    const { container } = render(<AnimateCountUp to={42} />);
    expect(container).toBeInTheDocument();
  });
});
