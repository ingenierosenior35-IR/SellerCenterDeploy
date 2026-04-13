jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { ProfileCompletionCard } from './index';

describe('ProfileCompletionCard', () => {
  it('renders progress bar', () => {
    render(<ProfileCompletionCard progress={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders progress percentage text', () => {
    render(<ProfileCompletionCard progress={75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders with 0% progress', () => {
    render(<ProfileCompletionCard progress={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('renders with 100% progress', () => {
    render(<ProfileCompletionCard progress={100} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
