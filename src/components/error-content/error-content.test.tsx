jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets', appName: 'Test', appVersion: '1.0.0' },
}));
jest.mock('minimal-shared/utils', () => ({
  varAlpha: jest.fn(() => 'rgba(0,0,0,0.1)'),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { ErrorContent } from './error-content';

describe('ErrorContent', () => {
  it('renders with default title "No data"', () => {
    render(<ErrorContent />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<ErrorContent title="An error occurred" />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<ErrorContent description="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(<ErrorContent action={<button>Go back</button>} />);
    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
  });

  it('renders default image', () => {
    render(<ErrorContent />);
    const img = screen.getByAltText('Empty content');
    expect(img).toBeInTheDocument();
  });

  it('renders custom imgUrl', () => {
    render(<ErrorContent imgUrl="/error.svg" />);
    const img = screen.getByAltText('Empty content');
    expect(img.getAttribute('src')).toBe('/error.svg');
  });
});
