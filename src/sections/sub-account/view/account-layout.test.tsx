import { render, screen } from '@testing-library/react';

import { AccountLayout } from './account-layout';

let mockPathname = '/account/subaccount/';

jest.mock('minimal-shared/utils', () => ({
  removeLastSlash: (value: string) => (value !== '/' && value.endsWith('/') ? value.slice(0, -1) : value),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
  }),
}));

jest.mock('src/routes/hooks', () => ({
  usePathname: () => mockPathname,
}));

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="home-content">{children}</div>
  ),
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: { heading: string }) => <div data-testid="breadcrumbs">{heading}</div>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: () => <span data-testid="iconify" />,
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('@mui/material/Tabs', () => ({
  __esModule: true,
  default: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <div data-testid="tabs" data-value={value}>
      {children}
    </div>
  ),
}));

jest.mock('@mui/material/Tab', () => ({
  __esModule: true,
  default: ({ label, href }: { label: string; href: string }) => <a href={href}>{label}</a>,
}));


describe('AccountLayout', () => {
  it('renders breadcrumbs and children', () => {
    mockPathname = '/account/subaccount/';

    render(
      <AccountLayout>
        <div>child content</div>
      </AccountLayout>
    );

    expect(screen.getByTestId('home-content')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('accountLayout.breadcrumbs.heading');
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('selects general tab when pathname has trailing slash', () => {
    mockPathname = '/account/subaccount/';

    render(
      <AccountLayout>
        <div />
      </AccountLayout>
    );

    expect(screen.getByTestId('tabs')).toHaveAttribute('data-value', '/account/subaccount');
    expect(screen.getByRole('link', { name: 'General' })).toHaveAttribute('href', '/account/subaccount');
    expect(screen.getByRole('link', { name: 'Security' })).toHaveAttribute(
      'href',
      '/account/subaccount/change-password'
    );
  });

  it('selects security tab when pathname points to change-password', () => {
    mockPathname = '/account/subaccount/change-password/';

    render(
      <AccountLayout>
        <div />
      </AccountLayout>
    );

    expect(screen.getByTestId('tabs')).toHaveAttribute(
      'data-value',
      '/account/subaccount/change-password'
    );
  });
});
