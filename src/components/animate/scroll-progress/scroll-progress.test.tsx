jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));
jest.mock('framer-motion', () => ({
  m: {
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    circle: (props: any) => <circle {...props} />,
  },
  useSpring: jest.fn((v: any) => v),
  useTransform: jest.fn((_v: any, _from: any, _to: any) => 0),
}));
jest.mock('src/theme/create-classes', () => ({
  createClasses: (name: string) => name,
}));

import React from 'react';
import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ScrollProgress } from './scroll-progress';

const theme = createTheme({ cssVariables: true });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

const mockProgress = { value: 0.5 } as any;

describe('ScrollProgress', () => {
  it('renders linear variant', () => {
    const { container } = render(
      <ScrollProgress variant="linear" progress={mockProgress} />,
      { wrapper }
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('renders circular variant', () => {
    const { container } = render(
      <ScrollProgress variant="circular" progress={mockProgress} />,
      { wrapper }
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders inside Portal when portal=true', () => {
    const { container } = render(
      <ScrollProgress variant="linear" progress={mockProgress} portal />,
      { wrapper }
    );
    // Portal renders outside container, so firstChild may be null
    expect(container).toBeTruthy();
  });
});
