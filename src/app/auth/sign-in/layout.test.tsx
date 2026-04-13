import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import Layout from './layout';

jest.mock('src/auth/guard', () => ({
  GuestGuard: ({ children }: any) => <div data-testid="guest-guard">{children}</div>,
}));

const theme = createTheme();

describe('SignInLayout', () => {
  it('renders children', () => {
    render(
      <ThemeProvider theme={theme}>
        <Layout><div data-testid="child" /></Layout>
      </ThemeProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('guest-guard')).toBeInTheDocument();
  });
});
