import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { FormDivider } from './form-divider';

const theme = createTheme();

describe('FormDivider', () => {
  it('renders default OR label', () => {
    render(<ThemeProvider theme={theme}><FormDivider /></ThemeProvider>);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('renders custom label', () => {
    render(<ThemeProvider theme={theme}><FormDivider label="AND" /></ThemeProvider>);
    expect(screen.getByText('AND')).toBeInTheDocument();
  });
});
