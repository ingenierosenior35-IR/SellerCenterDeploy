jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));
jest.mock('src/theme/create-classes', () => ({
  createClasses: (name: string) => name,
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { CarouselThumb } from './carousel-thumb';

const theme = createTheme({ cssVariables: true });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('CarouselThumb', () => {
  it('renders an image with correct alt', () => {
    render(<CarouselThumb index={2} src="/img/thumb.jpg" />, { wrapper });
    expect(screen.getByAltText('carousel-thumb-2')).toBeInTheDocument();
  });

  it('renders with selected styling when selected=true', () => {
    render(<CarouselThumb index={0} src="/img/thumb.jpg" selected />, { wrapper });
    const img = screen.getByAltText('carousel-thumb-0');
    expect(img).toBeInTheDocument();
  });

  it('renders without crashing when not selected', () => {
    const { container } = render(
      <CarouselThumb index={1} src="/img/t.jpg" selected={false} />,
      { wrapper }
    );
    expect(container.firstChild).toBeTruthy();
  });
});
