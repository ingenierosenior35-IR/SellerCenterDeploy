import React from 'react';
import { render, screen } from '@testing-library/react';

import { FormReturnLink } from './form-return-link';

jest.mock('src/routes/components', () => ({
  RouterLink: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

describe('FormReturnLink', () => {
  it('renders default icon and label', () => {
    render(<FormReturnLink href="/auth/sign-in" />);
    expect(screen.getByText('Return to sign in')).toBeInTheDocument();
    expect(screen.getByTestId('icon-eva:arrow-ios-back-fill')).toBeInTheDocument();
  });

  it('renders custom icon and label', () => {
    render(
      <FormReturnLink href="/x" icon={<span data-testid="custom-icon" />} label="Back now" />
    );
    expect(screen.getByText('Back now')).toBeInTheDocument();
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<FormReturnLink href="/x">extra</FormReturnLink>);
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('extra');
  });
});
