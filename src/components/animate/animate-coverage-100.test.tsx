import React from 'react';
import { domMax } from 'framer-motion';
import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import features from './features';
import * as animateIndex from './index';
import { MotionLazy } from './motion-lazy';
import { AnimateText } from './animate-text';
import { AnimateBorder } from './animate-border';
import { MotionViewport } from './motion-viewport';
import { MotionContainer } from './motion-container';
import { BackToTopButton } from './back-to-top-button';
import { AnimateLogoZoom, AnimateLogoRotate } from './animate-logo';

const mockedUseBackToTop = jest.fn();
const mockedUseMediaQuery = jest.fn();
const mockedUseAnimationStart = jest.fn();
const mockedUseInView = jest.fn();
const mockedMotionValueSet = jest.fn();

jest.mock('minimal-shared/hooks', () => ({
  useBackToTop: (...args: unknown[]) => mockedUseBackToTop(...args),
}));

jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockedUseMediaQuery(...args),
}));

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...classes: any[]) => classes.flat().filter(Boolean).join(' '),
  varAlpha: (color: string, alpha: number | string) => `rgba(${color}/${alpha})`,
}));

jest.mock('framer-motion', () => {
  const ReactActual = jest.requireActual('react');
  return {
    domMax: 'domMax-feature',
    LazyMotion: ({ children, features: loadFeatures }: { children: React.ReactNode; features?: () => Promise<unknown> }) => {
      ReactActual.useEffect(() => {
        void loadFeatures?.();
      }, [loadFeatures]);
      return <div data-testid="lazy-motion">{children}</div>;
    },
    m: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
      span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
    useInView: (...args: unknown[]) => mockedUseInView(...args),
    useAnimation: () => ({
      start: mockedUseAnimationStart,
    }),
    useAnimationFrame: (callback: (time: number) => void) => {
      ReactActual.useEffect(() => {
        callback(1000);
      }, [callback]);
    },
    useMotionValue: () => ({
      set: mockedMotionValueSet,
    }),
    useTransform: (_mv: unknown, transform: (val: number) => number) => transform(10),
    useMotionTemplate: () => 'translateX(1px) translateY(2px)',
  };
});

jest.mock('../iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('../logo', () => ({
  Logo: () => <div data-testid="logo" />,
}));

const theme = createTheme({ cssVariables: true } as any);
(theme as any).mixins = {
  ...(theme as any).mixins,
  borderGradient: ({ padding, color }: { padding?: string; color?: string }) => ({
    border: `1px solid ${color ?? 'transparent'}`,
    padding,
  }),
};

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('animate 100 coverage harness', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockedUseBackToTop.mockReturnValue({
      isVisible: true,
      onBackToTop: jest.fn(),
    });
    mockedUseMediaQuery.mockReturnValue(false);
    mockedUseInView.mockReturnValue(true);
    mockedUseAnimationStart.mockResolvedValue(undefined);
    mockedMotionValueSet.mockClear();

    Object.defineProperty(window, 'getComputedStyle', {
      configurable: true,
      value: jest.fn(() => ({
        borderBottomLeftRadius: '13px',
        borderBottomRightRadius: '14px',
        borderTopLeftRadius: '11px',
        borderTopRightRadius: '12px',
        display: 'block',
        paddingBottom: '4px',
        paddingLeft: '1px',
        paddingRight: '2px',
        paddingTop: '3px',
      })),
    });

    Object.defineProperty(SVGElement.prototype, 'getTotalLength', {
      configurable: true,
      value: jest.fn(() => 100),
    });
    Object.defineProperty(SVGElement.prototype, 'getPointAtLength', {
      configurable: true,
      value: jest.fn(() => ({ x: 10, y: 20 })),
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('covers animate component exports and key branches', () => {
    renderWithTheme(<BackToTopButton />);
    renderWithTheme(
      <BackToTopButton
        renderButton={(isVisible) => <button type="button">{isVisible ? 'visible' : 'hidden'}</button>}
      />
    );
    renderWithTheme(<BackToTopButton sx={[{ m: 1 }]} />);
    fireEvent.click(screen.getAllByLabelText('Back to top')[0]);

    renderWithTheme(<MotionLazy><div>lazy child</div></MotionLazy>);

    renderWithTheme(<AnimateLogoZoom />);
    renderWithTheme(<AnimateLogoZoom slotProps={{ logo: { sx: [{ m: 1 }] } as any }} />);
    renderWithTheme(<AnimateLogoZoom slotProps={{ logo: { sx: { m: 1 } } as any }} />);
    renderWithTheme(<AnimateLogoZoom logo={<span>custom-logo</span>} />);
    renderWithTheme(<AnimateLogoRotate />);
    renderWithTheme(<AnimateLogoRotate slotProps={{ logo: { sx: [{ m: 1 }] } as any }} />);
    renderWithTheme(<AnimateLogoRotate slotProps={{ logo: { sx: { m: 1 } } as any }} />);
    renderWithTheme(<AnimateLogoRotate logo={<span>custom-rotate</span>} />);

    renderWithTheme(
      <MotionContainer action animate={false}>
        <span>container-exit</span>
      </MotionContainer>
    );
    renderWithTheme(
      <MotionContainer action animate>
        <span>container-animate</span>
      </MotionContainer>
    );
    renderWithTheme(<MotionContainer><span>container-default</span></MotionContainer>);

    renderWithTheme(<MotionViewport disableAnimate={false}><span>viewport-animated</span></MotionViewport>);
    mockedUseMediaQuery.mockReturnValueOnce(true);
    renderWithTheme(<MotionViewport disableAnimate><span>viewport-disabled</span></MotionViewport>);

    renderWithTheme(
      <AnimateText repeatDelayMs={0} textContent={['Hola mundo', 'Linea dos']} />
    );
    mockedUseInView.mockReturnValueOnce(true);
    renderWithTheme(<AnimateText repeatDelayMs={10} textContent="single line" />);
    mockedUseInView.mockReturnValueOnce(false);
    renderWithTheme(<AnimateText repeatDelayMs={10} textContent="out of view line" />);
    jest.advanceTimersByTime(20);

    renderWithTheme(
      <AnimateBorder
        slotProps={{
          outlineColor: (currentTheme) => currentTheme.vars.palette.primary.main,
          primaryBorder: { size: 12, width: '2px', sx: [{ m: 1 }] },
          secondaryBorder: { size: 10, width: '1px', sx: [{ p: 1 }] },
          svgSettings: { rx: '20%', ry: '20%' },
        }}
      >
        <span>border-child</span>
      </AnimateBorder>
    );
    renderWithTheme(
      <AnimateBorder
        slotProps={{
          primaryBorder: { size: 12, width: '2px' },
          secondaryBorder: { size: 10, width: '1px', sx: { p: 1 } },
        }}
      />
    );

    Object.defineProperty(SVGElement.prototype, 'getTotalLength', {
      configurable: true,
      value: jest.fn(() => {
        throw new Error('no-length');
      }),
    });
    Object.defineProperty(SVGElement.prototype, 'getPointAtLength', {
      configurable: true,
      value: jest.fn(() => {
        throw new Error('no-point');
      }),
    });
    renderWithTheme(<AnimateBorder />);
    Object.defineProperty(SVGElement.prototype, 'getTotalLength', {
      configurable: true,
      value: jest.fn(() => 100),
    });
    Object.defineProperty(SVGElement.prototype, 'getPointAtLength', {
      configurable: true,
      value: jest.fn(() => {
        throw new Error('no-point');
      }),
    });
    renderWithTheme(<AnimateBorder />);

    expect(features).toBe(domMax);
    expect(animateIndex).toBeDefined();
    expect(screen.getAllByTestId('logo').length).toBeGreaterThan(0);
    expect(screen.getByText('lazy child')).toBeInTheDocument();
  });
});
