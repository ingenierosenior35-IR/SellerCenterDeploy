jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));
jest.mock('src/theme/create-classes', () => ({
  createClasses: (name: string) => name,
}));
jest.mock('../utils', () => ({
  getSlideSize: jest.fn(() => '100%'),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { CarouselSlide } from './carousel-slide';

const theme = createTheme({ cssVariables: true });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('CarouselSlide', () => {
  it('renders children directly when no parallax', () => {
    render(
      <ul>
        <CarouselSlide options={{ axis: 'x' }}>
          <span>Slide content</span>
        </CarouselSlide>
      </ul>,
      { wrapper }
    );
    expect(screen.getByText('Slide content')).toBeInTheDocument();
  });

  it('wraps children in parallax divs when parallax=true', () => {
    const { container } = render(
      <ul>
        <CarouselSlide options={{ parallax: true }}>
          <span>Parallax</span>
        </CarouselSlide>
      </ul>,
      { wrapper }
    );
    expect(container.querySelectorAll('div').length).toBeGreaterThan(0);
    expect(screen.getByText('Parallax')).toBeInTheDocument();
  });
});
