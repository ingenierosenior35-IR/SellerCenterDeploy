import { render, screen } from '@testing-library/react';

import Layout from './layout';

jest.mock('src/global-config', () => ({
  CONFIG: { auth: { skip: true } },
}));

jest.mock('src/layouts/home/layout', () => ({
  HomeLayout: ({ children }: any) => <div data-testid="home-layout">{children}</div>,
}));

jest.mock('src/auth/guard', () => ({
  AuthGuard: ({ children }: any) => <div data-testid="auth-guard">{children}</div>,
}));

describe('FeedbackLayout', () => {
  it('renders children', () => {
    render(<Layout><div data-testid="child" /></Layout>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
