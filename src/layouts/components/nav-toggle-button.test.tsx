import React from 'react';
import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { NavToggleButton } from './nav-toggle-button';

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0,0,0,0.1)',
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

const theme = createTheme({ cssVariables: true } as any);
(theme as any).vars = {
  ...(theme as any).vars,
  palette: {
    ...(theme as any).vars?.palette,
    grey: {
      ...((theme as any).vars?.palette?.grey ?? {}),
      '500Channel': '115 115 115',
    },
  },
};

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('NavToggleButton', () => {
  it('renders back icon when nav is expanded', () => {
    renderWithTheme(<NavToggleButton isNavMini={false} />);
    expect(screen.getByTestId('icon-eva:arrow-ios-back-fill')).toBeInTheDocument();
  });

  it('renders forward icon when nav is mini', () => {
    renderWithTheme(<NavToggleButton isNavMini />);
    expect(screen.getByTestId('icon-eva:arrow-ios-forward-fill')).toBeInTheDocument();
  });
});
