import React from 'react';
import { render, screen } from '@testing-library/react';

import { AccountButton } from './account-button';

jest.mock('src/components/animate', () => ({
  varTap: () => ({}),
  varHover: () => ({}),
  transitionTap: () => ({}),
  AnimateBorder: ({ children }: any) => <div data-testid="animate-border">{children}</div>,
}));

describe('AccountButton', () => {
  it('renders avatar with alt and src', () => {
    render(<AccountButton photoURL="/me.png" displayName="Juan" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Juan');
  });

  it('renders first letter fallback', () => {
    render(<AccountButton photoURL="" displayName="juan" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });
});
