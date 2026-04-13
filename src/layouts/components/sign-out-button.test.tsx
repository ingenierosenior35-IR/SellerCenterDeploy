import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

import { SignOutButton } from './sign-out-button';

const refresh = jest.fn();
const logout = jest.fn();

jest.mock('minimal-shared/utils', () => ({ varAlpha: () => 'rgba(0,0,0,0.1)' }));
jest.mock('src/global-config', () => ({ CONFIG: { assetsDir: '/assets' } }));
jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({ translate: (k: string) => k }),
}));
jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ refresh }),
}));
jest.mock('src/auth/hooks', () => ({
  useAuthContext: () => ({ logout }),
}));
jest.mock('src/components/svg-color', () => ({
  SvgColor: ({ src }: any) => <span data-testid={`svg-${src}`} />,
}));

describe('SignOutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    logout.mockResolvedValue(undefined);
  });

  it('renders translated label', () => {
    render(<SignOutButton />);
    expect(screen.getByRole('button', { name: 'logout' })).toBeInTheDocument();
  });

  it('calls logout and router.refresh', async () => {
    render(<SignOutButton />);
    fireEvent.click(screen.getByRole('button', { name: 'logout' }));

    await waitFor(() => {
      expect(logout).toHaveBeenCalled();
      expect(refresh).toHaveBeenCalled();
    });
  });
});
