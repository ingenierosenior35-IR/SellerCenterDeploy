import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('./styles', () => ({
  __esModule: true,
  LabelRoot: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  LabelIcon: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

jest.mock('./classes', () => ({
  labelClasses: {
    root: 'label-root',
    icon: 'label-icon',
  },
}));

import { Label } from './label';

describe('Label', () => {
  it('renders children text', () => {
    render(<Label>active</Label>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders non-string children as-is', () => {
    render(
      <Label>
        <span data-testid="icon">*</span>
      </Label>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders startIcon when provided', () => {
    render(<Label startIcon={<span data-testid="start-icon" />}>label</Label>);
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('renders endIcon when provided', () => {
    render(<Label endIcon={<span data-testid="end-icon" />}>label</Label>);
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('does not render startIcon when not provided', () => {
    render(<Label>label</Label>);
    expect(screen.queryByTestId('start-icon')).not.toBeInTheDocument();
  });
});
