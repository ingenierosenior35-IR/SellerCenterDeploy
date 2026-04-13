import React from 'react';
import { render, screen } from '@testing-library/react';

import { LoadingScreen } from './loading-screen';

describe('LoadingScreen', () => {
  it('renders a linear progress bar by default', () => {
    render(<LoadingScreen />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
  });

  it('renders custom slot progress when provided', () => {
    render(<LoadingScreen slots={{ progress: <div data-testid="custom-progress" /> }} />);
    expect(screen.getByTestId('custom-progress')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('renders content in a portal when portal=true', () => {
    render(<LoadingScreen portal />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
  });
});
