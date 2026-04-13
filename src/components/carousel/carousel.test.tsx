jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));
jest.mock('./components/carousel-slide', () => ({
  CarouselSlide: ({ children }: any) => <div data-testid="carousel-slide">{children}</div>,
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { Carousel } from './carousel';

const mockCarousel = {
  mainRef: { current: null },
  options: { axis: 'x' as const, slideSpacing: '16px' },
  pluginNames: [],
};

describe('Carousel', () => {
  it('renders children as slides', () => {
    render(
      <Carousel carousel={mockCarousel as any}>
        <div key="slide-1">Slide 1</div>
        <div key="slide-2">Slide 2</div>
      </Carousel>
    );
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
  });

  it('renders root element', () => {
    const { container } = render(
      <Carousel carousel={mockCarousel as any}>
        <div key="s1">Content</div>
      </Carousel>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with vertical axis', () => {
    const verticalCarousel = { ...mockCarousel, options: { axis: 'y' as const, slideSpacing: '0px' } };
    const { container } = render(
      <Carousel carousel={verticalCarousel as any}>
        <div key="s1">Content</div>
      </Carousel>
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
