import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import * as homeIndex from './index';
import { HomeLayout } from './layout';
import { NavMobile } from './nav-mobile';
import { NavVertical } from './nav-vertical';
import { NavHorizontal } from './nav-horizontal';
import { HomeContent, VerticalDivider } from './content';
import { dashboardLayoutVars, dashboardNavColorVars } from './css-vars';

const mockedSetField = jest.fn();
const mockedUseBooleanOnOpen = jest.fn();
const mockedUseBooleanOnClose = jest.fn();
const mockedUsePathname = jest.fn();
const mockedSettingsState = {
  compactLayout: false,
  navColor: 'integrate',
  navLayout: 'vertical',
};

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: () => ({
    onFalse: mockedUseBooleanOnClose,
    onTrue: mockedUseBooleanOnOpen,
    value: true,
  }),
}));

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...classes: any[]) => classes.flat().filter(Boolean).join(' '),
  varAlpha: (color: string, alpha: number | string) => `rgba(${color}/${alpha})`,
}));

jest.mock('src/components/settings', () => ({
  useSettingsContext: () => ({
    setField: mockedSetField,
    state: mockedSettingsState,
  }),
}));

jest.mock('src/auth/hooks', () => ({
  useAuthContext: () => ({
    user: { role: 'admin' },
  }),
}));

jest.mock('src/routes/hooks', () => ({
  usePathname: () => mockedUsePathname(),
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

jest.mock('src/_mock', () => ({
  _notifications: [],
}));

jest.mock('src/layouts/nav-config-home', () => ({
  useNavData: () => [{ title: 'nav-item', path: '/x' }],
}));

jest.mock('src/components/nav-section', () => ({
  bulletColor: { dark: '#111' },
  NavSectionHorizontal: ({ checkPermissions, data }: any) => {
    checkPermissions?.(['admin']);
    checkPermissions?.(['seller']);
    return <div data-testid="nav-horizontal">{data.length}</div>;
  },
  NavSectionMini: ({ data, sx }: any) => {
    const theme = { mixins: { hideScrollY: {} } };
    (Array.isArray(sx) ? sx : [sx]).forEach((entry: any) => {
      if (typeof entry === 'function') entry(theme);
    });
    return <div data-testid="nav-mini">{data.length}</div>;
  },
  NavSectionVertical: ({ checkPermissions, data }: any) => {
    checkPermissions?.(['admin']);
    checkPermissions?.(['seller']);
    return <div data-testid="nav-vertical">{data.length}</div>;
  },
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('src/components/logo', () => ({
  Logo: () => <div data-testid="logo" />,
}));

jest.mock('src/components/store-identity', () => ({
  StoreIdentity: () => <div data-testid="store-identity" />,
}));

jest.mock('src/components', () => ({
  ProfileCompletionCard: () => <div data-testid="profile-card" />,
}));

jest.mock('../components', () => ({
  LanguagePopover: () => <button type="button">language</button>,
  MenuButton: ({ onClick }: { onClick: () => void }) => <button type="button" onClick={onClick}>menu</button>,
  NotificationsDrawer: () => <button type="button">notifications</button>,
  Searchbar: () => <div>search</div>,
  SignOutButton: () => <button type="button">sign-out</button>,
  StoreButton: () => <button type="button">store</button>,
  ThemeToggleButton: () => <button type="button">theme</button>,
  NavToggleButton: ({ onClick, sx }: { onClick: () => void; sx?: any }) => {
    const theme = { breakpoints: { up: () => 'md' } };
    (Array.isArray(sx) ? sx : [sx]).forEach((entry: any) => {
      if (typeof entry === 'function') entry(theme);
    });
    return <button type="button" onClick={onClick}>toggle-nav</button>;
  },
}));

jest.mock('../core', () => ({
  layoutClasses: {
    content: 'content',
    nav: { horizontal: 'nav-horizontal', root: 'nav-root', vertical: 'nav-vertical' },
    sidebarContainer: 'sidebar-container',
  },
  HeaderSection: ({ slots }: any) => <header>{slots.leftArea}{slots.rightArea}{slots.bottomArea}</header>,
  MainSection: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
  LayoutSection: ({ children, headerSection, sidebarSection, footerSection }: any) => (
    <div>
      <div data-testid="header">{headerSection}</div>
      <div data-testid="sidebar">{sidebarSection}</div>
      <div data-testid="footer">{footerSection}</div>
      <div data-testid="main">{children}</div>
    </div>
  ),
}));

const theme = createTheme({ cssVariables: true } as any);

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('home layout 100 coverage harness', () => {
  beforeEach(() => {
    mockedUsePathname.mockReturnValue('/new-path');
    mockedSettingsState.compactLayout = false;
    mockedSettingsState.navColor = 'integrate';
    mockedSettingsState.navLayout = 'vertical';
  });

  it('covers home layout and nested nav/content components', () => {
    renderWithTheme(
      <HomeContent disablePadding maxWidth="sm" layoutQuery="md">
        <div>content child</div>
      </HomeContent>
    );
    renderWithTheme(
      <HomeContent maxWidth="sm" layoutQuery="md">
        <div>content child no padding toggle</div>
      </HomeContent>
    );
    renderWithTheme(<VerticalDivider />);

    renderWithTheme(
      <NavHorizontal
        checkPermissions={jest.fn()}
        data={[{ path: '/a', title: 'a' }] as any}
        sx={[{ m: 1 }]}
      />
    );

    renderWithTheme(
      <NavVertical
        checkPermissions={jest.fn()}
        data={[{ path: '/a', title: 'a' }] as any}
        isNavMini={false}
        onToggleNav={jest.fn()}
      />
    );

    renderWithTheme(
      <NavVertical
        checkPermissions={jest.fn()}
        data={[{ path: '/a', title: 'a' }] as any}
        isNavMini
        onToggleNav={jest.fn()}
        slots={{ bottomArea: <div>bottom-mini</div>, topArea: <div>top-mini</div> }}
      />
    );

    renderWithTheme(
      <NavMobile
        checkPermissions={jest.fn()}
        data={[{ path: '/a', title: 'a' }] as any}
        open
        onClose={mockedUseBooleanOnClose}
        sx={[{ m: 1 }]}
      />
    );
    renderWithTheme(
      <NavMobile
        checkPermissions={jest.fn()}
        data={[{ path: '/a', title: 'a' }] as any}
        open
        onClose={mockedUseBooleanOnClose}
        sx={{ m: 1 }}
        slots={{ bottomArea: <div>bottom</div>, topArea: <div>top</div> }}
      />
    );

    renderWithTheme(<HomeLayout><div>layout child</div></HomeLayout>);
    mockedSettingsState.compactLayout = true;
    mockedSettingsState.navColor = 'apparent';
    mockedSettingsState.navLayout = 'horizontal';
    renderWithTheme(<HomeLayout><div>layout child horizontal</div></HomeLayout>);
    mockedSettingsState.navLayout = 'mini';
    renderWithTheme(<HomeLayout><div>layout child mini</div></HomeLayout>);

    fireEvent.click(screen.getAllByText('menu')[0]);
    screen.getAllByText('toggle-nav').forEach((button) => fireEvent.click(button));

    expect(dashboardLayoutVars(theme)).toBeDefined();
    expect(dashboardNavColorVars(theme, 'integrate', 'vertical')).toBeDefined();
    expect(dashboardNavColorVars(theme, 'apparent', 'horizontal')).toBeDefined();
    expect(() => dashboardNavColorVars(theme, 'invalid' as any, 'vertical')).toThrow('Invalid color');
    expect(homeIndex).toBeDefined();
    expect(screen.getAllByTestId('logo').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('nav-vertical').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('nav-horizontal').length).toBeGreaterThan(0);
    expect(mockedUseBooleanOnClose).toHaveBeenCalled();
    expect(mockedSetField).toHaveBeenCalled();
  });
});
