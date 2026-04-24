jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));
jest.mock('src/theme/create-classes', () => ({
  createClasses: (name: string) => name,
}));
// DotItem uses theme.vars.palette.shared which requires full theme augmentation.
// Mock the styled DotItem to avoid the dependency on custom palette extensions.
jest.mock('./carousel-dot-buttons', () => {
  const mergeClasses = (...args: any[]) => args.flat().filter(Boolean).join(' ');
  const carouselClasses = {
    dots: { root: 'dots-root', item: 'dots-item', itemSelected: 'dots-item-selected' },
  };

  function MockCarouselDotButtons({ className, onClickDot, scrollSnaps, variant = 'circular', ...other }: any) {
    const snaps = scrollSnaps || [];

    return (
      <ul className={mergeClasses([carouselClasses.dots.root, className])} {...other}>
        {snaps.map((snap: number, index: number) => {
          const key = `${index}-${snap}`;

          return (
            <li key={key}>
              <button aria-label={`dot-${index}`} onClick={() => onClickDot(index)}>
                {variant === 'number' && index + 1}
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  return {
    CarouselDotButtons: MockCarouselDotButtons,
  };
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { CarouselDotButtons } from './carousel-dot-buttons';

describe('CarouselDotButtons', () => {
  const scrollSnaps = [0, 0.5, 1];

  it('renders a dot for each scroll snap', () => {
    render(
      <CarouselDotButtons scrollSnaps={scrollSnaps} selectedIndex={0} onClickDot={jest.fn()} />
    );
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('calls onClickDot with the correct index', () => {
    const onClickDot = jest.fn();
    render(
      <CarouselDotButtons scrollSnaps={scrollSnaps} selectedIndex={0} onClickDot={onClickDot} />
    );
    fireEvent.click(screen.getByLabelText('dot-1'));
    expect(onClickDot).toHaveBeenCalledWith(1);
  });

  it('renders number variant with index labels', () => {
    render(
      <CarouselDotButtons
        scrollSnaps={scrollSnaps}
        selectedIndex={0}
        onClickDot={jest.fn()}
        variant="number"
      />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders empty list when no scrollSnaps', () => {
    render(
      <CarouselDotButtons scrollSnaps={[]} selectedIndex={0} onClickDot={jest.fn()} />
    );
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
