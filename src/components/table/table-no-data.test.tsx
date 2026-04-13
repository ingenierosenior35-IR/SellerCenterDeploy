jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets', appName: 'Test', appVersion: '1.0.0' },
}));
jest.mock('minimal-shared/utils', () => ({
  varAlpha: jest.fn(() => 'rgba(0,0,0,0.1)'),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { TableNoData } from './table-no-data';

const theme = createTheme({ cssVariables: true });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('TableNoData', () => {
  it('renders empty cell when notFound is false', () => {
    render(
      <table>
        <tbody>
          <TableNoData notFound={false} />
        </tbody>
      </table>,
      { wrapper }
    );
    const row = screen.getByRole('row');
    expect(row).toBeInTheDocument();
  });

  it('renders EmptyContent when notFound is true', () => {
    render(
      <table>
        <tbody>
          <TableNoData notFound />
        </tbody>
      </table>,
      { wrapper }
    );
    expect(screen.getByRole('row')).toBeInTheDocument();
  });
});
