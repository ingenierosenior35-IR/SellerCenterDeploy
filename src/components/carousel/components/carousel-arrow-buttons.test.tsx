jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
  varAlpha: jest.fn(() => 'rgba(0,0,0,0.1)'),
}));
jest.mock('src/theme/create-classes', () => ({
  createClasses: (name: string) => name,
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ArrowButton } from './arrow-button';
import {
  CarouselArrowBasicButtons,
  CarouselArrowFloatButtons,
  CarouselArrowNumberButtons,
} from './carousel-arrow-buttons';

const theme = createTheme({ cssVariables: true });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('ArrowButton', () => {
  it('renders prev button with aria-label', () => {
    render(<ArrowButton variant="prev" />, { wrapper });
    expect(screen.getByLabelText('Prev button')).toBeInTheDocument();
  });

  it('renders next button with aria-label', () => {
    render(<ArrowButton variant="next" />, { wrapper });
    expect(screen.getByLabelText('Next button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<ArrowButton variant="next" onClick={onClick} />, { wrapper });
    fireEvent.click(screen.getByLabelText('Next button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('CarouselArrowBasicButtons', () => {
  it('renders prev and next buttons', () => {
    render(
      <CarouselArrowBasicButtons onClickPrev={jest.fn()} onClickNext={jest.fn()} />,
      { wrapper }
    );
    expect(screen.getByLabelText('Prev button')).toBeInTheDocument();
    expect(screen.getByLabelText('Next button')).toBeInTheDocument();
  });

  it('calls onClickPrev when prev is clicked', () => {
    const onClickPrev = jest.fn();
    render(
      <CarouselArrowBasicButtons onClickPrev={onClickPrev} onClickNext={jest.fn()} />,
      { wrapper }
    );
    fireEvent.click(screen.getByLabelText('Prev button'));
    expect(onClickPrev).toHaveBeenCalledTimes(1);
  });
});

describe('CarouselArrowFloatButtons', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <CarouselArrowFloatButtons onClickPrev={jest.fn()} onClickNext={jest.fn()} />,
      { wrapper }
    );
    expect(container).toBeTruthy();
  });
});

describe('CarouselArrowNumberButtons', () => {
  it('renders selectedIndex/totalSlides counter', () => {
    render(
      <CarouselArrowNumberButtons
        onClickPrev={jest.fn()}
        onClickNext={jest.fn()}
        selectedIndex={2}
        totalSlides={5}
      />,
      { wrapper }
    );
    expect(screen.getByText('2/5')).toBeInTheDocument();
  });
});
