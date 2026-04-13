import { render, screen, waitFor } from '@testing-library/react';

import { GuestGuard } from './guest-guard';

const mockReplace = jest.fn();
const mockUseAuthContext = jest.fn();
const mockGet = jest.fn();
const mockSafeReturnUrl = jest.fn();

jest.mock('minimal-shared/utils', () => ({
  safeReturnUrl: (...args: unknown[]) => mockSafeReturnUrl(...args),
}));

jest.mock('../hooks', () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => ({ get: mockGet }),
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

describe('GuestGuard', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockUseAuthContext.mockReset();
    mockGet.mockReset();
    mockSafeReturnUrl.mockReset();

    mockGet.mockReturnValue('/returns');
    mockSafeReturnUrl.mockImplementation((returnTo, fallback) => returnTo || fallback);
  });

  it('shows splash screen while auth is loading', () => {
    mockUseAuthContext.mockReturnValue({ authenticated: false, loading: true });

    render(
      <GuestGuard>
        <div>guest page</div>
      </GuestGuard>
    );

    expect(screen.getByTestId('splash-screen')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects authenticated users to safe return url', async () => {
    mockUseAuthContext.mockReturnValue({ authenticated: true, loading: false });

    render(
      <GuestGuard>
        <div>guest page</div>
      </GuestGuard>
    );

    expect(mockSafeReturnUrl).toHaveBeenCalledWith('/returns', '/home');

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/returns');
    });

    expect(screen.getByTestId('splash-screen')).toBeInTheDocument();
  });

  it('renders children when user is unauthenticated', async () => {
    mockUseAuthContext.mockReturnValue({ authenticated: false, loading: false });

    render(
      <GuestGuard>
        <div>guest page</div>
      </GuestGuard>
    );

    await waitFor(() => {
      expect(screen.getByText('guest page')).toBeInTheDocument();
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
