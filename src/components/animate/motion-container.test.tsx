jest.mock('framer-motion', () => ({
  m: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useInView: jest.fn(() => true),
  useMotionValue: jest.fn((v: any) => ({ get: () => v, set: jest.fn() })),
  useTransform: jest.fn(() => ({ get: () => '0' })),
  animate: jest.fn(),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { MotionContainer } from './motion-container';

describe('MotionContainer', () => {
  it('renders children', () => {
    render(
      <MotionContainer>
        <span>Content</span>
      </MotionContainer>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders with action mode', () => {
    render(
      <MotionContainer action animate>
        <span>Animated</span>
      </MotionContainer>
    );
    expect(screen.getByText('Animated')).toBeInTheDocument();
  });

  it('renders with action=false animate=false', () => {
    render(
      <MotionContainer action animate={false}>
        <span>Exiting</span>
      </MotionContainer>
    );
    expect(screen.getByText('Exiting')).toBeInTheDocument();
  });
});
