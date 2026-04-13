jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
  varAlpha: jest.fn(() => 'rgba(0,0,0,0.1)'),
  isActiveLink: jest.fn(() => false),
  isExternalLink: jest.fn(() => false),
}));
jest.mock('minimal-shared/hooks', () => ({
  usePopoverHover: jest.fn(() => ({
    open: false,
    onOpen: jest.fn(),
    onClose: jest.fn(),
    anchorEl: null,
    elementRef: { current: null },
  })),
}));
jest.mock('src/routes/hooks', () => ({
  usePathname: jest.fn(() => '/'),
}));
jest.mock('src/routes/components', () => ({
  RouterLink: 'a',
}));
jest.mock('src/theme/create-classes', () => ({
  createClasses: (name: string) => name,
}));
jest.mock('../../iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-icon={icon} />,
  iconifyClasses: { root: 'iconify-root' },
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { NavSectionMini } from './nav-section-mini';

const theme = createTheme({
  cssVariables: true,
  mixins: {
    maxLine: () => ({}),
    filledStyles: () => ({}),
  } as any,
});
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

const navData = [
  {
    subheader: 'Main',
    items: [
      { title: 'Dashboard', path: '/dashboard' },
      { title: 'Users', path: '/users' },
    ],
  },
];

describe('NavSectionMini', () => {
  it('renders nav items', () => {
    render(<NavSectionMini data={navData} />, { wrapper });
    expect(screen.getByLabelText('Dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Users')).toBeInTheDocument();
  });

  it('renders without crashing with empty data', () => {
    const { container } = render(<NavSectionMini data={[]} />, { wrapper });
    expect(container.firstChild).toBeTruthy();
  });
});
