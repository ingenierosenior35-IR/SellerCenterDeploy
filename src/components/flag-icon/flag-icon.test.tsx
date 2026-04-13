jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { FlagIcon } from './flag-icon';

const theme = createTheme({ cssVariables: true });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('FlagIcon', () => {
  it('renders nothing when no code provided', () => {
    const { container } = render(<FlagIcon />, { wrapper });
    expect(container.firstChild).toBeNull();
  });

  it('renders flag image for a country code', () => {
    render(<FlagIcon code="US" />, { wrapper });
    const img = screen.getByAltText('US');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toContain('US');
  });

  it('uppercases the country code in image src', () => {
    render(<FlagIcon code="gb" />, { wrapper });
    const img = screen.getByAltText('gb');
    expect(img.getAttribute('src')).toContain('GB');
  });
});
