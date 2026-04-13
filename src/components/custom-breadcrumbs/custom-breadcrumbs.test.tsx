jest.mock('src/routes/components', () => ({
  RouterLink: 'a',
}));
jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { CustomBreadcrumbs } from './custom-breadcrumbs';

const theme = createTheme({ cssVariables: true });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('CustomBreadcrumbs', () => {
  it('renders heading when provided', () => {
    render(<CustomBreadcrumbs heading="Dashboard" />, { wrapper });
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders links when provided', () => {
    render(
      <CustomBreadcrumbs
        links={[
          { name: 'Home', href: '/' },
          { name: 'Settings', href: '/settings' },
        ]}
      />,
      { wrapper }
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(<CustomBreadcrumbs action={<button>Add</button>} />, { wrapper });
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('renders without crashing when no props', () => {
    const { container } = render(<CustomBreadcrumbs />, { wrapper });
    expect(container).toBeInTheDocument();
  });
});
