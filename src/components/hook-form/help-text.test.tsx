import React from 'react';
import { render, screen } from '@testing-library/react';

import { HelperText } from './help-text';

describe('HelperText', () => {
  it('returns null when no message', () => {
    const { container } = render(<HelperText />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders helperText', () => {
    render(<HelperText helperText="help" />);
    expect(screen.getByText('help')).toBeInTheDocument();
  });

  it('prioritizes errorMessage over helperText', () => {
    render(<HelperText helperText="help" errorMessage="error" />);
    expect(screen.getByText('error')).toBeInTheDocument();
    expect(screen.queryByText('help')).not.toBeInTheDocument();
  });

  it('applies disableGutters branch', () => {
    render(<HelperText helperText="x" disableGutters />);
    expect(screen.getByText('x')).toBeInTheDocument();
  });
});