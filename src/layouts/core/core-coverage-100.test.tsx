import React from 'react';
import { render, screen } from '@testing-library/react';

const mockUseScrollOffsetTop = jest.fn();
const appBarTheme = {
  vars: {
    palette: {
      text: { primary: '#222' },
    },
  },
};

jest.mock('minimal-shared/hooks', () => ({
  useScrollOffsetTop: () => mockUseScrollOffsetTop(),
}));

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...classes: any[]) => classes.flat().filter(Boolean).join(' '),
  varAlpha: (color: string, alpha: string | number) => `rgba(${color}/${alpha})`,
}));

jest.mock('@mui/material/AppBar', () => ({
  __esModule: true,
  default: ({ children, sx, ...other }: any) => {
    (Array.isArray(sx) ? sx : [sx]).forEach((entry: any) => {
      if (typeof entry === 'function') {
        entry(appBarTheme);
      }
    });

    return <header {...other}>{children}</header>;
  },
}));

jest.mock('@mui/material/Container', () => ({
  __esModule: true,
  default: ({ children, ...other }: any) => <div {...other}>{children}</div>,
}));

jest.mock('@mui/material/GlobalStyles', () => ({
  __esModule: true,
  default: ({ styles }: any) => {
    if (typeof styles === 'function') {
      styles({
        zIndex: { drawer: 1200, appBar: 1100 },
      });
    }

    return <div data-testid="global-styles" />;
  },
}));

jest.mock('@mui/material/styles', () => {
  const ReactLib = jest.requireActual('react');
  const actual = jest.requireActual('@mui/material/styles');

  const mockTheme = {
    vars: {
      palette: {
        text: { primary: '#111' },
        background: { defaultChannel: '255 255 255' },
      },
      customShadows: { z8: '0 0 8px rgba(0,0,0,.3)' },
    },
    breakpoints: { up: (value: string) => `@media ${value}` },
    mixins: { bgBlur: () => ({ backdropFilter: 'blur(8px)' }) },
    transitions: {
      create: () => 'transition',
      easing: { easeInOut: 'easeInOut' },
      duration: { shorter: 120 },
    },
  };

  const styled = (Component: any, options?: { shouldForwardProp?: (prop: string) => boolean }) => (stylesArg: any) => {
    if (typeof options?.shouldForwardProp === 'function') {
      options.shouldForwardProp('isOffset');
      options.shouldForwardProp('disableOffset');
      options.shouldForwardProp('disableElevation');
      options.shouldForwardProp('sx');
      options.shouldForwardProp('className');
    }

    if (typeof stylesArg === 'function') {
      stylesArg({
        theme: { ...mockTheme, direction: 'ltr' },
        isOffset: true,
        disableOffset: false,
        disableElevation: false,
        layoutQuery: 'md',
      });
      stylesArg({
        theme: { ...mockTheme, direction: 'rtl' },
        isOffset: false,
        disableOffset: true,
        disableElevation: true,
        layoutQuery: 'lg',
      });
    }

    return ({ children, ...props }: any) => {
      if (typeof Component === 'string') {
        return ReactLib.createElement(Component, props, children);
      }

      return ReactLib.createElement(Component, props, children);
    };
  };

  return { ...actual, styled };
});

import * as coreExports from './index';
import { MainSection } from './main-section';
import { HeaderSection } from './header-section';
import { LayoutSection } from './layout-section';

describe('layouts core coverage harness', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exports core modules from index', () => {
    expect(coreExports.layoutClasses).toBeDefined();
    expect(coreExports.layoutSectionVars).toBeDefined();
    expect(coreExports.HeaderSection).toBeDefined();
    expect(coreExports.LayoutSection).toBeDefined();
    expect(coreExports.MainSection).toBeDefined();
  });

  it('renders HeaderSection with all slot areas and offset states', () => {
    mockUseScrollOffsetTop.mockReturnValue({ offsetTop: true });

    const { rerender } = render(
      <HeaderSection
        disableOffset={false}
        disableElevation={false}
        slots={{
          topArea: <div>top</div>,
          leftArea: <div>left</div>,
          centerArea: <div>center</div>,
          rightArea: <div>right</div>,
          bottomArea: <div>bottom</div>,
        }}
        slotProps={{ container: { 'data-testid': 'header-container' }, centerArea: { id: 'center-area' } }}
      />
    );

    expect(screen.getByText('top')).toBeInTheDocument();
    expect(screen.getByText('left')).toBeInTheDocument();
    expect(screen.getByText('center')).toBeInTheDocument();
    expect(screen.getByText('right')).toBeInTheDocument();
    expect(screen.getByText('bottom')).toBeInTheDocument();
    expect(screen.getByTestId('header-container')).toBeInTheDocument();

    mockUseScrollOffsetTop.mockReturnValue({ offsetTop: false });
    rerender(
      <HeaderSection
        disableOffset
        disableElevation
        sx={[{ border: 0 }]}
        slots={{ centerArea: <div>center 2</div> }}
      />
    );
    expect(screen.getByText('center 2')).toBeInTheDocument();
  });

  it('renders LayoutSection in both sidebar and non-sidebar modes', () => {
    const { rerender } = render(
      <LayoutSection
        className="custom-layout"
        headerSection={<div>header</div>}
        sidebarSection={<aside>sidebar</aside>}
        footerSection={<footer>footer</footer>}
      >
        <div>content</div>
      </LayoutSection>
    );

    expect(screen.getByTestId('global-styles')).toBeInTheDocument();
    expect(screen.getByText('sidebar')).toBeInTheDocument();
    expect(screen.getByText('header')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
    expect(screen.getByText('footer')).toBeInTheDocument();

    rerender(
      <LayoutSection headerSection={<div>header 2</div>} footerSection={<footer>footer 2</footer>}>
        <div>content 2</div>
      </LayoutSection>
    );

    expect(screen.queryByText('sidebar')).not.toBeInTheDocument();
    expect(screen.getByText('header 2')).toBeInTheDocument();
    expect(screen.getByText('content 2')).toBeInTheDocument();
    expect(screen.getByText('footer 2')).toBeInTheDocument();
  });

  it('renders MainSection children and merged class names', () => {
    render(
      <MainSection className="custom-main" data-testid="main-section">
        <div>main child</div>
      </MainSection>
    );

    expect(screen.getByTestId('main-section')).toHaveClass('minimal__layout__main');
    expect(screen.getByTestId('main-section')).toHaveClass('custom-main');
    expect(screen.getByText('main child')).toBeInTheDocument();
  });
});
