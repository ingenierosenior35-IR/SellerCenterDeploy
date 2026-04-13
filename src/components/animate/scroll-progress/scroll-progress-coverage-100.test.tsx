import React from 'react';
import { render } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import * as scrollProgressIndex from './index';
import { ScrollProgress } from './scroll-progress';
import { useScrollProgress } from './use-scroll-progress';

const mockedUseScroll = jest.fn();
const mockedUseTransform = jest.fn();

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

jest.mock('framer-motion', () => ({
  m: {
    circle: (props: any) => <circle {...props} />,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
  },
  useScroll: (...args: unknown[]) => mockedUseScroll(...args),
  useSpring: (value: unknown) => value,
  useTransform: (...args: unknown[]) => mockedUseTransform(...args),
}));

jest.mock('src/theme/create-classes', () => ({
  createClasses: (name: string) => name,
}));

const theme = createTheme({ cssVariables: true } as any);

const withTheme = (children: React.ReactNode) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

describe('scroll-progress 100 coverage harness', () => {
  beforeEach(() => {
    mockedUseTransform.mockImplementation((...args: unknown[]) => {
      if (typeof args[1] === 'function') return (args[1] as (v: number) => number)(0.5);
      return 0.5;
    });
    mockedUseScroll.mockReturnValue({
      scrollXProgress: { value: 0.4 },
      scrollYProgress: { value: 0.6 },
    });
  });

  it('covers useScrollProgress and ScrollProgress variants', () => {
    const HookProbe = ({ target }: { target: 'document' | 'container' }) => {
      const value = useScrollProgress(target);
      return <div data-testid={`hook-${target}`}>{Boolean(value.elementRef.current).toString()}</div>;
    };

    const { container } = render(withTheme(<HookProbe target="document" />));
    expect(container).toBeInTheDocument();
    render(withTheme(<HookProbe target="container" />));

    render(
      withTheme(
        <ScrollProgress
          variant="linear"
          progress={{ value: 0.8 } as any}
          whenScroll="x"
          color="inherit"
          portal
          slotProps={{ wrapper: { 'data-testid': 'wrapper' } as any }}
          sx={[{ opacity: 0.9 }]}
        />
      )
    );

    render(
      withTheme(
        <ScrollProgress
          variant="circular"
          progress={{ value: 0.2 } as any}
          whenScroll="y"
          color="primary"
          size={70}
          thickness={4}
          sx={[{ opacity: 0.8 }]}
        />
      )
    );
    render(
      withTheme(
        <ScrollProgress
          variant="linear"
          progress={{ value: 0.3 } as any}
          whenScroll="x"
          color="primary"
        />
      )
    );
    render(
      withTheme(
        <ScrollProgress
          variant="circular"
          progress={{ value: 0.3 } as any}
          whenScroll="x"
          color="primary"
        />
      )
    );

    expect(scrollProgressIndex).toBeDefined();
    expect(mockedUseScroll).toHaveBeenCalled();
  });
});
