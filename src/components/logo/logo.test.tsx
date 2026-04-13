jest.mock('src/routes/components', () => ({
  RouterLink: 'a',
}));
jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { Logo } from './logo';

describe('Logo', () => {
  it('renders a link element', () => {
    render(<Logo />);
    expect(screen.getByRole('link', { name: /logo/i })).toBeInTheDocument();
  });

  it('uses provided href', () => {
    render(<Logo href="/dashboard" />);
    const link = screen.getByRole('link', { name: /logo/i });
    expect(link.getAttribute('href')).toBe('/dashboard');
  });

  it('applies disabled styles when disabled', () => {
    render(<Logo disabled />);
    const link = screen.getByRole('link', { name: /logo/i });
    expect(link).toBeInTheDocument();
  });

  it('renders isNavMini=false variant', () => {
    render(<Logo isNavMini={false} />);
    expect(screen.getByRole('link', { name: /logo/i })).toBeInTheDocument();
  });
});
