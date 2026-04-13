jest.mock('framer-motion', () => ({
  m: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  useInView: jest.fn(() => true),
  useMotionValue: jest.fn(() => ({ get: () => 0, set: jest.fn() })),
  useTransform: jest.fn(() => ({ get: () => '0' })),
  animate: jest.fn(),
}));
jest.mock('minimal-shared/utils', () => ({
  mergeRefs: jest.fn(([ref1]: any[]) => ref1),
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

import React from 'react';
import { render } from '@testing-library/react';

import { Image } from './image';

describe('Image', () => {
  it('renders without crashing', () => {
    const { container } = render(<Image src="/test.jpg" alt="Test" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with a ratio', () => {
    const { container } = render(<Image src="/test.jpg" alt="Test" ratio="16/9" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with visibleByDefault', () => {
    const { container } = render(<Image src="/test.jpg" alt="Test" visibleByDefault />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
