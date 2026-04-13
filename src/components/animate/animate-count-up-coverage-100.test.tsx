import React from 'react';
import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AnimateCountUp } from './animate-count-up';

const mockedUseInView = jest.fn();
const mockedAnimate = jest.fn();

jest.mock('framer-motion', () => ({
  m: {
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  animate: (...args: unknown[]) => mockedAnimate(...args),
  useInView: (...args: unknown[]) => mockedUseInView(...args),
  useMotionValue: jest.fn(() => 0),
  useTransform: jest.fn((_value: any, transform: (latest: number) => string) => transform(1234.56)),
}));

const theme = createTheme({ cssVariables: true } as any);

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('animate-count-up 100 coverage harness', () => {
  beforeEach(() => {
    mockedUseInView.mockReturnValue(true);
  });

  it('covers number-shortening and float branches', () => {
    renderWithTheme(<AnimateCountUp to={1200} toFixed={2} />);
    renderWithTheme(<AnimateCountUp to={5000000} toFixed={2} unit="m" />);
    renderWithTheme(<AnimateCountUp to={2000000000} toFixed={2} />);
    renderWithTheme(<AnimateCountUp to={999} from={10} toFixed={0} />);
    mockedUseInView.mockReturnValueOnce(false);
    renderWithTheme(<AnimateCountUp sx={[{ m: 1 }]} to={200} toFixed={0} />);

    expect(screen.getAllByText('k').length).toBeGreaterThan(0);
    expect(mockedAnimate).toHaveBeenCalled();
  });
});
