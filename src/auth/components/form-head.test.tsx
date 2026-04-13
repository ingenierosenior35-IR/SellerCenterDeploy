import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { FormHead } from './form-head';

const theme = createTheme();

describe('FormHead', () => {
  it('renders title', () => {
    render(<ThemeProvider theme={theme}><FormHead title="Sign In" /></ThemeProvider>);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <ThemeProvider theme={theme}>
        <FormHead title="Test" icon={<span data-testid="icon" />} />
      </ThemeProvider>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
