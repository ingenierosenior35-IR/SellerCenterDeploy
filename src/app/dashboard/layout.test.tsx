import { render, screen } from '@testing-library/react';

import { CONFIG } from 'src/global-config';

import Layout from './layout';

jest.mock('src/global-config', () => ({
  CONFIG: { auth: { skip: true } },
}));

jest.mock('src/layouts/home', () => ({
  HomeLayout: ({ children }: any) => <div data-testid="home-layout">{children}</div>,
}));

jest.mock('src/auth/guard', () => ({
  AuthGuard: ({ children }: any) => <div data-testid="auth-guard">{children}</div>,
}));

describe('DashboardLayout', () => {
  beforeEach(() => {
    CONFIG.auth.skip = true;
  });

  it('renders HomeLayout directly when auth.skip is true', () => {
    render(
      <Layout>
        <div data-testid="child" />
      </Layout>
    );

    expect(screen.getByTestId('home-layout')).toBeInTheDocument();
    expect(screen.queryByTestId('auth-guard')).not.toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('wraps content in AuthGuard when auth.skip is false', () => {
    CONFIG.auth.skip = false;

    render(
      <Layout>
        <div data-testid="child" />
      </Layout>
    );

    expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
    expect(screen.getByTestId('home-layout')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
