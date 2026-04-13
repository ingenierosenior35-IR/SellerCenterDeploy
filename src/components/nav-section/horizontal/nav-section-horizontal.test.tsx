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
jest.mock('../../scrollbar', () => ({
  Scrollbar: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));
jest.mock('../../iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-icon={icon} />,
  iconifyClasses: { root: 'iconify-root' },
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { NavSectionHorizontal } from './nav-section-horizontal';

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
      { title: 'Home', path: '/' },
      { title: 'About', path: '/about' },
    ],
  },
];

describe('NavSectionHorizontal', () => {
  it('renders nav items', () => {
    render(<NavSectionHorizontal data={navData} />, { wrapper });
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('About')).toBeInTheDocument();
  });

  it('renders without crashing with empty data', () => {
    const { container } = render(<NavSectionHorizontal data={[]} />, { wrapper });
    expect(container.firstChild).toBeTruthy();
  });
});
