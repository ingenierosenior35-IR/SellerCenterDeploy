import { render, screen, waitFor } from '@testing-library/react';

import { AuthGuard } from './auth-guard';

const mockReplace = jest.fn();
const mockUseAuthContext = jest.fn();
const mockUsePathname = jest.fn();

jest.mock('../hooks', () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => mockUsePathname(),
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    auth: {
      signIn: '/auth/sign-in',
      auth0: { signIn: '/auth/auth0/sign-in' },
      amplify: { signIn: '/auth/amplify/sign-in' },
      firebase: { signIn: '/auth/firebase/sign-in' },
      supabase: { signIn: '/auth/supabase/sign-in' },
    },
  },
}));

jest.mock('src/global-config', () => ({
  CONFIG: {
    auth: {
      method: 'jwt',
      redirectPath: '/home',
      skip: false,
    },
  },
}));

jest.mock('src/components/loading-screen', () => ({
  SplashScreen: () => <div data-testid="splash-screen" />,
}));

describe('AuthGuard', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockUseAuthContext.mockReset();
    mockUsePathname.mockReset();
    mockUsePathname.mockReturnValue('/products');
  });

  it('shows splash screen while auth is loading', () => {
    mockUseAuthContext.mockReturnValue({ authenticated: false, loading: true });

    render(
      <AuthGuard>
        <div>protected content</div>
      </AuthGuard>
    );

    expect(screen.getByTestId('splash-screen')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects unauthenticated users to sign in with returnTo query', async () => {
    mockUseAuthContext.mockReturnValue({ authenticated: false, loading: false });

    render(
      <AuthGuard>
        <div>protected content</div>
      </AuthGuard>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/auth/sign-in?returnTo=%2Fproducts');
    });

    expect(screen.getByTestId('splash-screen')).toBeInTheDocument();
  });

  it('renders children for authenticated users', async () => {
    mockUseAuthContext.mockReturnValue({ authenticated: true, loading: false });

    render(
      <AuthGuard>
        <div>protected content</div>
      </AuthGuard>
    );

    await waitFor(() => {
      expect(screen.getByText('protected content')).toBeInTheDocument();
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
