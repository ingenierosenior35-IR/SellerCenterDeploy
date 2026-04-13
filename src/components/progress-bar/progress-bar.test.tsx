jest.mock('nprogress', () => ({
  configure: jest.fn(),
  start: jest.fn(),
  done: jest.fn(),
}));
jest.mock('src/routes/hooks', () => ({
  usePathname: jest.fn(() => '/'),
}));
jest.mock('minimal-shared/utils', () => ({
  isEqualPath: jest.fn(() => false),
}));

import React from 'react';
import NProgress from 'nprogress';
import { render } from '@testing-library/react';

import { ProgressBar } from './progress-bar';

describe('ProgressBar', () => {
  it('renders null (returns nothing visible)', () => {
    const { container } = render(<ProgressBar />);
    expect(container.firstChild).toBeNull();
  });

  it('configures NProgress on mount', () => {
    render(<ProgressBar />);
    expect(NProgress.configure).toHaveBeenCalledWith({ showSpinner: false });
  });
});
