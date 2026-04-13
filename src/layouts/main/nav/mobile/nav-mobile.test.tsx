import { render, screen } from '@testing-library/react';

import { NavMobile } from './nav-mobile';

const mockUsePathname = jest.fn();

jest.mock('src/routes/hooks', () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock('@mui/material/Drawer', () => ({
  __esModule: true,
  default: ({ children, open }: { children: React.ReactNode; open?: boolean }) => (
    <div data-testid="mobile-drawer" data-open={String(Boolean(open))}>
      {children}
    </div>
  ),
}));

jest.mock('src/components/logo', () => ({
  Logo: () => <div data-testid="mobile-logo" />,
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: { children: React.ReactNode }) => <div data-testid="mobile-scroll">{children}</div>,
}));

jest.mock('../../../components/sign-in-button', () => ({
  SignInButton: () => <button type="button">sign in</button>,
}));

jest.mock('../components', () => ({
  Nav: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  NavUl: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
}));

jest.mock('./nav-mobile-list', () => ({
  NavList: ({ data }: any) => <li>{data.title}</li>,
}));

describe('NavMobile', () => {
  beforeEach(() => {
    mockUsePathname.mockReset();
    mockUsePathname.mockReturnValue('/');
  });

  it('renders default top and bottom areas with nav items', () => {
    render(
      <NavMobile
        open={false}
        onClose={jest.fn()}
        data={[
          { title: 'Home', path: '/' },
          { title: 'Products', path: '/products' },
        ]}
      />
    );

    expect(screen.getByTestId('mobile-drawer')).toHaveAttribute('data-open', 'false');
    expect(screen.getByTestId('mobile-logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'sign in' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Purchase' })).toBeInTheDocument();
  });

  it('calls onClose when open and pathname changes effect runs', () => {
    const onClose = jest.fn();

    mockUsePathname.mockReturnValue('/new-path');

    render(<NavMobile open onClose={onClose} data={[{ title: 'Home', path: '/' }]} />);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
