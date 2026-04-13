import React from 'react';
import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({ cssVariables: true } as any);

// Asegura vars.primary.* usados en ilustraciones
(theme as any).vars = {
  ...(theme as any).vars,
  palette: {
    ...(theme as any).vars?.palette,
    primary: {
      lighter: '#e3f2fd',
      light: '#64b5f6',
      main: '#1976d2',
      dark: '#1565c0',
      darker: '#0d47a1',
    },
  },
};

export function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}
