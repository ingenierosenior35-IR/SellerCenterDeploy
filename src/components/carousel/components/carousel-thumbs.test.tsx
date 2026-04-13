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

import { CarouselThumbs } from './carousel-thumbs';

const theme = createTheme({ cssVariables: true });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('CarouselThumbs', () => {
  it('renders child thumbnails', () => {
    render(
      <CarouselThumbs>
        <img key="1" src="/a.jpg" alt="thumb-a" />
        <img key="2" src="/b.jpg" alt="thumb-b" />
      </CarouselThumbs>,
      { wrapper }
    );
    expect(screen.getByAltText('thumb-a')).toBeInTheDocument();
    expect(screen.getByAltText('thumb-b')).toBeInTheDocument();
  });

  it('renders with y axis option', () => {
    const { container } = render(
      <CarouselThumbs options={{ axis: 'y' }}>
        <span key="x">item</span>
      </CarouselThumbs>,
      { wrapper }
    );
    expect(container.firstChild).toBeTruthy();
  });
});
