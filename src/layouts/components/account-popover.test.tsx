import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { AccountPopover } from './account-popover';

const onClose = jest.fn();
const onOpen = jest.fn();

jest.mock('minimal-shared/hooks', () => ({
  usePopover: () => ({
    open: true,
    anchorEl: document.body,
    onClose,
    onOpen,
  }),
}));

jest.mock('src/auth/hooks', () => ({
  useAuthContext: () => ({
    user: { firstname: 'Juan', lastname: 'Pérez', email: 'juan@mail.com' },
  }),
}));

jest.mock('src/routes/hooks', () => ({
  usePathname: () => '/dashboard',
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ href, children, onClick }: any) => (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  ),
}));

jest.mock('src/components/custom-popover', () => ({
  CustomPopover: ({ children }: any) => <div data-testid="custom-popover">{children}</div>,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span data-testid="label">{children}</span>,
}));

jest.mock('./account-button', () => ({
  AccountButton: ({ onClick }: any) => (
    <button onClick={onClick} aria-label="Account button">
      account
    </button>
  ),
}));

jest.mock('./sign-out-button', () => ({
  SignOutButton: () => <button>signout</button>,
}));

describe('AccountPopover', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders user info', () => {
    render(<AccountPopover />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('juan@mail.com')).toBeInTheDocument();
  });

  it('opens popover on account button click', () => {
    render(<AccountPopover />);
    fireEvent.click(screen.getByRole('button', { name: /Account button/i }));
    expect(onOpen).toHaveBeenCalled();
  });

  it('renders menu items and info label', () => {
    render(
      <AccountPopover
        data={[{ label: 'Home', href: '/home', info: '3', icon: <span data-testid="i1" /> }]}
      />
    );
    // ✅ para pathname '/dashboard' + label 'Home' se muestra 'Home'
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByTestId('label')).toHaveTextContent('3');
  });

  it('closes when menu link is clicked', () => {
    render(<AccountPopover data={[{ label: 'Profile', href: '/profile' }]} />);
    fireEvent.click(screen.getByRole('link', { name: /Profile/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
