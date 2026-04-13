jest.mock('minimal-shared/utils', () => ({
  noRtlFlip: (value: string) => value,
  remToPx: (value: string) => Number(value.replace('rem', '')) * 16,
  varAlpha: (color: string, alpha: number | string) => `rgba(${color}/${alpha})`,
}));

import { mixins } from './mixins';
import * as mixinsIndex from './index';
import { borderGradient } from './border';
import { maxLine, textGradient } from './text';
import { bgBlur, bgGradient } from './background';
import { softStyles, paperStyles, filledStyles, menuItemStyles } from './global-styles-components';

const makeTheme = () =>
  ({
    applyStyles: (_mode: string, styles: any) => styles,
    mixins: { bgGradient },
    shape: { borderRadius: 8 },
    spacing: (...values: number[]) => values.map((value) => `${value * 8}px`).join(' '),
    typography: {
      body2: { fontSize: '0.875rem' },
      fontWeightSemiBold: 600,
      pxToRem: (value: number) => `${value / 16}rem`,
    },
    vars: {
      customShadows: { dropdown: 'shadow-dropdown' },
      opacity: {
        filled: { commonHoverBg: 0.16 },
        soft: { bg: 0.08, commonBg: 0.08, commonHoverBg: 0.16, hoverBg: 0.16 },
      },
      palette: {
        action: { hover: '#efefef', selected: '#e0e0e0' },
        background: { paperChannel: '255 255 255' },
        text: { disabledChannel: '120 120 120' },
        common: {
          black: '#000',
          blackChannel: '0 0 0',
          white: '#fff',
          whiteChannel: '255 255 255',
        },
        grey: {
          300: '#d4d4d4',
          400: '#bdbdbd',
          700: '#616161',
          800: '#424242',
          '500Channel': '115 115 115',
        },
        primary: {
          contrastText: '#fff',
          dark: '#0033aa',
          light: '#66a3ff',
          main: '#0055ff',
          mainChannel: '0 85 255',
        },
      },
    },
  }) as any;

describe('theme mixins coverage harness', () => {
  it('covers all runtime mixins and style helpers', () => {
    const theme = makeTheme();

    expect(bgGradient({ images: ['linear-gradient(red, blue)'] }).backgroundSize).toBe('cover');
    expect(
      bgGradient({
        images: ['url(a)', 'url(b)'],
        positions: ['top', 'bottom'],
        repeats: ['repeat', 'no-repeat'],
        sizes: ['10px', '20px'],
      }).backgroundPosition
    ).toContain('top');

    expect(bgBlur({ color: '#00000033' }).backdropFilter).toContain('blur');
    expect(bgBlur({ blur: 12, color: '#ffffff22', imgUrl: '/asset.png' }).position).toBe('relative');

    expect(borderGradient().padding).toBe('2px');
    expect(borderGradient({ color: 'linear-gradient(red, blue)', padding: '4px' }).background).toContain('linear-gradient');

    expect(textGradient('to right, red, blue').WebkitTextFillColor).toBe('transparent');
    expect(maxLine({ line: 2 }).WebkitLineClamp).toBe(2);
    expect(
      maxLine({ line: 3, persistent: { fontSize: '1rem', lineHeight: '1.5rem' } }).height
    ).toBeGreaterThan(0);

    expect(menuItemStyles(theme)[`& .MuiCheckbox-root`]).toBeDefined();
    expect(paperStyles(theme).backgroundImage).toContain('data:image/svg+xml');
    expect(paperStyles(theme, { blur: 8, color: '#111111aa', dropdown: true }).boxShadow).toBe('shadow-dropdown');

    expect(filledStyles(theme, 'default').backgroundColor).toBe(theme.vars.palette.grey[300]);
    expect(filledStyles(theme, 'inherit').backgroundColor).toBeDefined();
    expect(filledStyles(theme, 'white').backgroundColor).toBe(theme.vars.palette.common.white);
    expect(filledStyles(theme, 'black').backgroundColor).toBe(theme.vars.palette.common.black);
    expect(filledStyles(theme, 'primary').backgroundColor).toBe(theme.vars.palette.primary.main);
    expect(filledStyles(theme, 'primary', { hover: { outline: '1px solid red' } })['&:hover'].outline).toBe(
      '1px solid red'
    );
    expect(filledStyles(theme, undefined as any)).toEqual({});

    expect(softStyles(theme, 'default').boxShadow).toBe('none');
    expect(softStyles(theme, 'inherit').backgroundColor).toContain('rgba');
    expect(softStyles(theme, 'white').color).toBe(theme.vars.palette.common.white);
    expect(softStyles(theme, 'black').color).toBe(theme.vars.palette.common.black);
    expect(softStyles(theme, 'primary').color).toBeDefined();
    expect(softStyles(theme, 'primary', { hover: true })['&:hover']).toBeDefined();
    expect(softStyles(theme, undefined as any)).toEqual({});

    expect(maxLine({ line: 2, persistent: { lineHeight: 1.5 } }).WebkitLineClamp).toBe(2);
    expect(maxLine({ line: 2, persistent: { fontSize: '1rem' } }).WebkitLineClamp).toBe(2);
    expect(maxLine({ line: 2, persistent: { fontSize: '1rem', lineHeight: 1.5, '@media-sm': { fontSize: '0rem' } as any } as any }).WebkitLineClamp).toBe(2);

    expect(mixins.hideScrollX).toBeDefined();
    expect(mixins.hideScrollY).toBeDefined();
    expect(mixins.scrollbarStyles?.(theme as any).scrollbarWidth).toBe('thin');
    expect(mixins.bgBlur).toBe(bgBlur);
    expect(mixins.maxLine).toBe(maxLine);
    expect(mixins.bgGradient).toBe(bgGradient);
    expect(mixins.softStyles).toBe(softStyles);
    expect(mixins.paperStyles).toBe(paperStyles);
    expect(mixins.textGradient).toBe(textGradient);
    expect(mixins.filledStyles).toBe(filledStyles);
    expect(mixins.borderGradient).toBe(borderGradient);
    expect(mixins.menuItemStyles).toBe(menuItemStyles);

    expect(mixinsIndex).toBeDefined();
  });
});
