import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import * as navExport from './mobile';
import * as desktopExport from './desktop';
import { NavMobile } from './mobile/nav-mobile';
import { NavDesktop } from './desktop/nav-desktop';
import { NavItem as NavMobileItem } from './mobile/nav-mobile-item';
import { NavItem as NavDesktopItem } from './desktop/nav-desktop-item';
import { NavItemDashboard } from './desktop/nav-desktop-item-dashboard';

const mockedPathname = jest.fn();
const mockedIsActiveLink = jest.fn();
const mockedIsEqualPath = jest.fn();
const mockedIsExternalLink = jest.fn();
const mockedVarAlpha = jest.fn(() => 'rgba(0 0 0 / 0.12)');

jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets' },
}));

jest.mock('src/routes/hooks', () => ({
  usePathname: () => mockedPathname(),
}));

jest.mock('minimal-shared/utils', () => ({
  isActiveLink: (...args: unknown[]) => mockedIsActiveLink(...args),
  isEqualPath: (...args: unknown[]) => mockedIsEqualPath(...args),
  isExternalLink: (...args: unknown[]) => mockedIsExternalLink(...args),
  mergeClasses: (...classes: any[]) => classes.flat().filter(Boolean).join(' '),
  varAlpha: (...args: unknown[]) => mockedVarAlpha(...args),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/nav-section', () => ({
  NavSectionVertical: ({ data }: { data: Array<{ title: string }> }) => (
    <div data-testid="vertical-collapse">{data.map((item) => item.title).join(',')}</div>
  ),
  createNavItem: ({ path, icon }: any) => ({
    baseProps: {
      href: path,
      onClick: undefined,
    },
    renderIcon: icon ? <span data-testid="render-icon">{String(icon)}</span> : null,
  }),
  navItemStyles: {
    arrow: () => ({ color: 'inherit' }),
    icon: { color: 'inherit' },
    title: () => ({ color: 'inherit' }),
  },
  navSectionClasses: {
    item: { root: 'item-root', title: 'item-title' },
    state: { active: 'active', open: 'open' },
  },
}));

jest.mock('./components', () => ({
  Nav: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  NavDropdown: ({ children, open }: { children: React.ReactNode; open: boolean }) => (
    <div data-testid={`dropdown-${open}`}>{children}</div>
  ),
  NavLi: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  NavUl: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
}));

jest.mock('./mobile/nav-mobile-list', () => ({
  NavList: ({ data }: any) => <li data-testid={`mobile-list-${data.title}`}>{data.title}</li>,
}));

jest.mock('./desktop/nav-desktop-list', () => ({
  NavList: ({ data }: any) => <li data-testid={`desktop-list-${data.title}`}>{data.title}</li>,
}));

jest.mock('src/components/logo', () => ({
  Logo: () => <div data-testid="logo" />,
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@mui/material/Drawer', () => ({
  __esModule: true,
  default: ({ children, open }: { children: React.ReactNode; open: boolean }) => (
    <div data-testid={`drawer-${open}`}>{children}</div>
  ),
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('src/components/animate', () => ({
  transitionTap: () => ({ duration: 0.1 }),
  varHover: () => ({ scale: 1.01 }),
  varTap: () => ({ scale: 0.99 }),
}));

describe('main nav exports coverage harness', () => {
  const theme = createTheme({ cssVariables: true } as any);

  beforeEach(() => {
    mockedPathname.mockReset();
    mockedIsActiveLink.mockReset();
    mockedIsEqualPath.mockReset();
    mockedIsExternalLink.mockReset();
    mockedPathname.mockReturnValue('/a');
    mockedIsActiveLink.mockReturnValue(false);
    mockedIsEqualPath.mockReturnValue(false);
    mockedIsExternalLink.mockReturnValue(false);
  });

  it('covers desktop and mobile nav exports and item variants', () => {
    expect(navExport).toBeDefined();
    expect(desktopExport).toBeDefined();

    const renderWithTheme = (ui: React.ReactElement) =>
      render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

    renderWithTheme(
      <NavDesktop data={[{ path: '/a', title: 'A' } as any, { path: '/b', title: 'B' } as any]} />
    );
    expect(screen.getByTestId('desktop-list-A')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-list-B')).toBeInTheDocument();

    renderWithTheme(
      <NavMobile
        data={[{ path: '/a', title: 'A' } as any]}
        open
        onClose={jest.fn()}
        slots={{ bottomArea: <div>custom-bottom</div>, topArea: <div>custom-top</div> }}
      />
    );
    expect(screen.getByTestId('drawer-true')).toBeInTheDocument();
    expect(screen.getByText('custom-top')).toBeInTheDocument();
    expect(screen.getByText('custom-bottom')).toBeInTheDocument();

    renderWithTheme(
      <NavDesktopItem
        hasChild
        open
        active
        path="/desktop"
        title="Desktop item"
        onMouseEnter={jest.fn()}
      />
    );
    expect(screen.getByLabelText('Desktop item')).toBeInTheDocument();
    expect(screen.getByTestId('icon-eva:arrow-ios-downward-fill')).toBeInTheDocument();

    renderWithTheme(<NavDesktopItem path="/desktop-sub" subItem title="Desktop sub item" />);
    expect(screen.getByLabelText('Desktop sub item')).toBeInTheDocument();

    renderWithTheme(<NavMobileItem hasChild open active path="/mobile" title="Mobile item" />);
    expect(screen.getByLabelText('Mobile item')).toBeInTheDocument();

    renderWithTheme(<NavMobileItem path="/mobile-sub" subItem title="Mobile sub item" />);
    expect(screen.getByLabelText('Mobile sub item')).toBeInTheDocument();

    renderWithTheme(<NavItemDashboard path="/dashboard" />);
    const img = screen.getByAltText('Dashboard illustration');
    fireEvent.mouseOver(img);
    fireEvent.mouseDown(img);
    expect(img).toBeInTheDocument();
  });
});
