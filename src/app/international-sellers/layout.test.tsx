import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import Layout from './layout';

const theme = createTheme();

describe('InternationalSellersLayout', () => {
  it('renders children', () => {
    render(
      <ThemeProvider theme={theme}>
        <Layout><div data-testid="child" /></Layout>
      </ThemeProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
