import { render, screen, fireEvent } from '@testing-library/react';

import { MainLayout } from './layout';

const mockOnOpen = jest.fn();
const mockOnClose = jest.fn();
const mockUsePathname = jest.fn();
const mockUseBooleanValue = jest.fn();

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: () => ({
    get value() {
      return mockUseBooleanValue();
    },
    onTrue: mockOnOpen,
    onFalse: mockOnClose,
  }),
}));

jest.mock('src/routes/hooks', () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock('src/components/logo', () => ({
  Logo: () => <div data-testid="main-logo" />,
}));

jest.mock('./nav/mobile', () => ({
  NavMobile: ({ open }: { open: boolean }) => <div data-testid="nav-mobile" data-open={String(open)} />,
}));

jest.mock('./nav/desktop', () => ({
  NavDesktop: ({ sx }: { sx?: any }) => {
    const theme = { breakpoints: { up: (value: string) => value } };
    (Array.isArray(sx) ? sx : [sx]).forEach((entry: any) => {
      if (typeof entry === 'function') entry(theme);
    });

    return <div data-testid="nav-desktop" />;
  },
}));

jest.mock('./footer', () => ({
  Footer: () => <footer data-testid="footer" />,
  HomeFooter: () => <footer data-testid="home-footer" />,
}));

jest.mock('../components/menu-button', () => ({
  MenuButton: ({ onClick, sx }: { onClick?: () => void; sx?: any }) => {
    const theme = { breakpoints: { up: (value: string) => value } };
    (Array.isArray(sx) ? sx : [sx]).forEach((entry: any) => {
      if (typeof entry === 'function') entry(theme);
    });

    return (
      <button type="button" onClick={onClick}>
      menu
      </button>
    );
  },
}));

jest.mock('@mui/material/Button', () => ({
  __esModule: true,
  default: ({ children, sx, ...other }: any) => {
    const theme = { breakpoints: { up: (value: string) => value } };
    (Array.isArray(sx) ? sx : [sx]).forEach((entry: any) => {
      if (typeof entry === 'function') entry(theme);
    });

    return <button {...other}>{children}</button>;
  },
}));

jest.mock('../components/sign-in-button', () => ({
  SignInButton: () => <button type="button">sign in</button>,
}));

jest.mock('../components/settings-button', () => ({
  SettingsButton: () => <button type="button">settings</button>,
}));

jest.mock('../nav-config-main', () => ({
  navData: [],
}));

jest.mock('../core', () => ({
  HeaderSection: ({ slots, sx }: { slots?: any; sx?: any }) => {
    const theme = { breakpoints: { up: (value: string) => value } };
    (Array.isArray(sx) ? sx : [sx]).forEach((entry: any) => {
      if (typeof entry === 'function') entry(theme);
    });

    return (
      <header>
        {slots?.topArea}
        {slots?.leftArea}
        {slots?.rightArea}
      </header>
    );
  },
  MainSection: ({ children, ...other }: { children: React.ReactNode }) => (
    <main data-testid="main-layout-content" {...other}>
      {children}
    </main>
  ),
  LayoutSection: ({ children, headerSection, footerSection }: any) => (
    <div>
      {headerSection}
      {children}
      {footerSection}
    </div>
  ),
}));

describe('MainLayout', () => {
  beforeEach(() => {
    mockOnOpen.mockReset();
    mockOnClose.mockReset();
    mockUsePathname.mockReset();
    mockUseBooleanValue.mockReset();
    mockUseBooleanValue.mockReturnValue(false);
  });

  it('renders HomeFooter on home path', () => {
    mockUsePathname.mockReturnValue('/');

    render(<MainLayout>Body</MainLayout>);

    expect(screen.getByTestId('home-footer')).toBeInTheDocument();
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  it('renders Footer on non-home path', () => {
    mockUsePathname.mockReturnValue('/returns');

    render(<MainLayout>Body</MainLayout>);

    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.queryByTestId('home-footer')).not.toBeInTheDocument();
  });

  it('opens mobile nav when menu button is clicked', () => {
    mockUsePathname.mockReturnValue('/');

    render(<MainLayout>Body</MainLayout>);

    fireEvent.click(screen.getByRole('button', { name: 'menu' }));
    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });

  it('passes open=true to NavMobile when boolean hook value is true', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseBooleanValue.mockReturnValue(true);

    render(<MainLayout>Body</MainLayout>);

    expect(screen.getByTestId('nav-mobile')).toHaveAttribute('data-open', 'true');
  });

  it('passes slotProps and custom nav data through layout sections', () => {
    mockUsePathname.mockReturnValue('/returns');

    render(
      <MainLayout
        slotProps={{
          nav: { data: [{ title: 'Custom', path: '/custom' } as any] },
          header: { sx: [{ border: 0 }] as any },
          footer: { sx: { border: 0 } as any },
          main: { id: 'main-custom' } as any,
        }}
      >
        Body
      </MainLayout>
    );

    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('main-layout-content')).toHaveAttribute('id', 'main-custom');
    expect(screen.getByTestId('nav-mobile')).toBeInTheDocument();
  });
});
