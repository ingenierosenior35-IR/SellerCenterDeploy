jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets', appName: 'Test App', appVersion: '1.0.0' },
}));
jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
  varAlpha: jest.fn(() => 'rgba(0,0,0,0.1)'),
  uuidv4: jest.fn(() => 'test-uuid'),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { EmptyContent } from './empty-content';

describe('EmptyContent', () => {
  it('renders with default title "No data"', () => {
    render(<EmptyContent />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<EmptyContent title="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyContent description="Please try again" />);
    expect(screen.getByText('Please try again')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<EmptyContent />);
    expect(screen.queryByText('Please try again')).not.toBeInTheDocument();
  });

  it('renders action node when provided', () => {
    render(<EmptyContent action={<button>Retry</button>} />);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('renders with default image', () => {
    render(<EmptyContent />);
    const img = screen.getByAltText('Empty content');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toContain('ic-content.svg');
  });

  it('renders with custom imgUrl', () => {
    render(<EmptyContent imgUrl="/custom-image.svg" />);
    const img = screen.getByAltText('Empty content');
    expect(img.getAttribute('src')).toBe('/custom-image.svg');
  });
});
