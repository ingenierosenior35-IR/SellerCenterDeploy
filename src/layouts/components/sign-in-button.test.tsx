import { render, screen } from '@testing-library/react';

import { SignInButton } from './sign-in-button';

jest.mock('src/routes/components', () => ({
  RouterLink: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('src/global-config', () => ({
  CONFIG: { auth: { redirectPath: '/auth/jwt/sign-in' } },
}));

describe('SignInButton', () => {
  it('renders sign in call to action and target href', () => {
    render(<SignInButton />);

    const link = screen.getByRole('link', { name: 'Sign in' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/auth/jwt/sign-in');
  });
});
