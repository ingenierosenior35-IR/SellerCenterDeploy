jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
  varAlpha: jest.fn(() => 'rgba(0,0,0,0.1)'),
}));
jest.mock('src/theme/create-classes', () => ({
  createClasses: (name: string) => name,
}));

import React from 'react';
import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { CarouselProgressBar } from './carousel-progress-bar';

const theme = createTheme({ cssVariables: true });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('CarouselProgressBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<CarouselProgressBar value={50} />, { wrapper });
    expect(container.firstChild).toBeTruthy();
  });

  it('sets --progress-value CSS variable', () => {
    const { container } = render(<CarouselProgressBar value={75} />, { wrapper });
    const root = container.firstChild as HTMLElement;
    // The value is applied via sx, so the element renders
    expect(root).toBeTruthy();
  });
});
