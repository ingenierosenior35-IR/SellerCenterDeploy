import { render, screen } from '@testing-library/react';

import Layout from './layout';

jest.mock('src/auth/guard', () => ({
  GuestGuard: ({ children }: any) => <div data-testid="guest-guard">{children}</div>,
}));

jest.mock('src/layouts/auth-split', () => ({
  AuthSplitLayout: ({ children }: any) => <div data-testid="auth-split-layout">{children}</div>,
}));

describe('SignUpLayout', () => {
  it('renders children', () => {
    render(<Layout><div data-testid="child" /></Layout>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
