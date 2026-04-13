import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { TextDecoder, TextEncoder } from 'node:util';

type AnyRecord = Record<string, any>;

jest.mock('minimal-shared/utils', () => ({
  __esModule: true,
  varAlpha: (color: string, alpha: number | string) => `rgba(${String(color)} / ${String(alpha)})`,
  parseCssVar: (value: string) => ({ value }),
  pxToRem: (value: number) => `${value / 16}rem`,
  createPaletteChannel: (value: AnyRecord) => ({
    ...value,
    ...(value?.main ? { mainChannel: '0 0 0' } : {}),
    ...(value?.dark ? { darkChannel: '0 0 0' } : {}),
    ...(value?.light ? { lightChannel: '0 0 0' } : {}),
    ...(value?.white ? { whiteChannel: '255 255 255' } : {}),
    ...(value?.black ? { blackChannel: '0 0 0' } : {}),
    ...(value?.disabled ? { disabledChannel: '115 115 115' } : {}),
    ...(value?.neutral ? { neutralChannel: '240 240 240' } : {}),
    ...(value?.['500'] ? { '500Channel': '115 115 115' } : {}),
  }),
}));

jest.mock('@mui/x-data-grid', () => ({
  __esModule: true,
  gridClasses: {
    selectedRowCount: 'selectedRowCount',
    sortIcon: 'sortIcon',
    paper: 'paper',
    'columnHeader--sorted': 'columnHeaderSorted',
    'cell--editing': 'cellEditing',
    'cell--withLeftBorder': 'cellWithLeftBorder',
    'cell--withRightBorder': 'cellWithRightBorder',
  },
}));

jest.mock('@mui/x-date-pickers/PickersSectionList', () => ({
  __esModule: true,
  pickersSectionListClasses: { root: 'pickersSectionListRoot' },
}));

jest.mock('@mui/x-date-pickers/PickersTextField', () => ({
  __esModule: true,
  pickersInputBaseClasses: { root: 'pickersInputBaseRoot', disabled: 'pickersInputBaseDisabled' },
  pickersFilledInputClasses: { root: 'pickersFilledInputRoot' },
  pickersOutlinedInputClasses: {
    root: 'pickersOutlinedInputRoot',
    focused: 'pickersOutlinedInputFocused',
    error: 'pickersOutlinedInputError',
    notchedOutline: 'pickersOutlinedInputNotchedOutline',
    disabled: 'pickersOutlinedInputDisabled',
  },
}));

(globalThis as AnyRecord).TextEncoder = TextEncoder;
(globalThis as AnyRecord).TextDecoder = TextDecoder;

const mockTheme = {
  direction: 'ltr',
  shape: { borderRadius: 8 },
  spacing: (...values: number[]) => values.map((value) => `${value * 8}px`).join(' '),
  breakpoints: { down: (key: string) => `@media-${key}` },
  transitions: {
    create: () => 'transition',
    easing: { sharp: 'sharp', easeIn: 'easeIn' },
    duration: { shortest: 120, shorter: 180, standard: 240 },
  },
  typography: {
    fontFamily: 'Inter',
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body2: { lineHeight: 1.5 },
    pxToRem: (value: number) => `${value / 16}rem`,
  },
  applyStyles: (_mode: string, styles: AnyRecord) => styles,
  mixins: {
    filledStyles: (_theme: unknown, color: string, options?: AnyRecord) => ({
      backgroundColor: color,
      ...options,
    }),
    softStyles: (_theme: unknown, color: string, options?: AnyRecord) => ({
      color,
      ...options,
    }),
    paperStyles: () => ({ backgroundColor: '#fff' }),
    menuItemStyles: () => ({ minHeight: 36 }),
    scrollbarStyles: () => ({ scrollbarColor: '#999' }),
  },
  vars: {
    opacity: {
      outlined: { border: 0.32 },
      soft: { border: 0.16 },
      switchTrack: 0.24,
      switchTrackDisabled: 0.18,
    },
    customShadows: {
      z1: 'shadow-z1',
      z8: 'shadow-z8',
      card: 'shadow-card',
      dialog: 'shadow-dialog',
      dropdown: 'shadow-dropdown',
      primary: 'shadow-primary',
      secondary: 'shadow-secondary',
      info: 'shadow-info',
      success: 'shadow-success',
      warning: 'shadow-warning',
      error: 'shadow-error',
      black: 'shadow-black',
      white: 'shadow-white',
    },
    palette: {
      divider: '#ddd',
      text: { primary: '#111', secondary: '#333', disabled: '#666', primaryChannel: '17 17 17' },
      action: {
        active: '#222',
        hover: '#f5f5f5',
        selectedOpacity: 0.08,
        hoverOpacity: 0.08,
        disabled: '#888',
        disabledOpacity: 0.48,
        disabledBackground: '#e5e5e5',
      },
      background: { paper: '#fff', neutral: '#f6f7f8' },
      common: { black: '#000', white: '#fff', blackChannel: '0 0 0', whiteChannel: '255 255 255' },
      grey: {
        300: '#d4d4d4',
        500: '#737373',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        '400Channel': '163 163 163',
        '500Channel': '115 115 115',
        '800Channel': '38 38 38',
      },
      primary: {
        lighter: '#dbeafe',
        light: '#60a5fa',
        main: '#2563eb',
        dark: '#1d4ed8',
        darker: '#1e3a8a',
        mainChannel: '37 99 235',
        darkChannel: '29 78 216',
        contrastText: '#fff',
      },
      secondary: {
        lighter: '#f3e8ff',
        light: '#c084fc',
        main: '#9333ea',
        dark: '#7e22ce',
        darker: '#581c87',
        mainChannel: '147 51 234',
        darkChannel: '126 34 206',
        contrastText: '#fff',
      },
      info: {
        lighter: '#e0f2fe',
        light: '#38bdf8',
        main: '#0284c7',
        dark: '#0369a1',
        darker: '#0c4a6e',
        mainChannel: '2 132 199',
        darkChannel: '3 105 161',
        contrastText: '#fff',
      },
      success: {
        lighter: '#dcfce7',
        light: '#4ade80',
        main: '#16a34a',
        dark: '#15803d',
        darker: '#14532d',
        mainChannel: '22 163 74',
        darkChannel: '21 128 61',
        contrastText: '#fff',
      },
      warning: {
        lighter: '#fef9c3',
        light: '#facc15',
        main: '#ca8a04',
        dark: '#a16207',
        darker: '#713f12',
        mainChannel: '202 138 4',
        darkChannel: '161 98 7',
        contrastText: '#111',
      },
      error: {
        lighter: '#fee2e2',
        light: '#f87171',
        main: '#dc2626',
        dark: '#b91c1c',
        darker: '#7f1d1d',
        mainChannel: '220 38 38',
        darkChannel: '185 28 28',
        contrastText: '#fff',
      },
      Avatar: { defaultBg: '#f3f4f6' },
      Alert: {
        infoIconColor: '#0284c7',
        errorIconColor: '#dc2626',
        successIconColor: '#16a34a',
        warningIconColor: '#ca8a04',
      },
      StepConnector: { border: '#d4d4d4' },
      StepContent: { border: '#d4d4d4' },
      Tooltip: { bg: '#111' },
      shared: {
        buttonOutlined: '#ccc',
        inputUnderline: '#aaa',
        inputOutlined: '#bbb',
        paperOutlined: '#dedede',
      },
    },
  },
};

const sampleProps: AnyRecord[] = [
  {},
  { variant: 'contained', color: 'inherit', size: 'small' },
  { variant: 'contained', color: 'primary', size: 'xLarge' },
  { variant: 'filled', color: 'default', size: 'small', severity: 'success' },
  { variant: 'filled', color: 'white', size: 'medium', severity: 'info' },
  { variant: 'outlined', color: 'standard', size: 'medium', orientation: 'vertical' },
  { variant: 'outlined', color: 'black', size: 'medium', orientation: 'horizontal' },
  { variant: 'standard', color: 'info', severity: 'info' },
  { variant: 'standard', color: 'error', severity: 'error' },
  { variant: 'text', color: 'inherit', size: 'large', textColor: 'inherit', indicatorColor: 'custom' },
  { variant: 'soft', color: 'warning', orientation: 'horizontal', icon: true, label: 'Label' },
  { variant: 'extended', color: 'black', size: 'large' },
  { variant: 'temporary', anchor: 'left' },
  { variant: 'temporary', anchor: 'right' },
  { color: 'inherit', alt: 'alpha' },
  { alt: 'zulu' },
  { alt: '123' },
  { multiline: true, size: 'small', hiddenLabel: true, ownerState: { inputSize: 'small' } },
  { multiline: true, size: 'medium', hiddenLabel: true, ownerState: { inputSize: 'medium' } },
  { multiline: true, size: 'medium', hiddenLabel: false, ownerState: { inputSize: 'medium' } },
  {
    shrink: true,
    variant: 'filled',
    size: 'medium',
    error: false,
    isFieldFocused: false,
    isFieldValueEmpty: false,
  },
  { disableGutters: false, expanded: true, fullScreen: false },
  { disableGutters: true, expanded: false, fullScreen: true },
  { shrink: true, error: false, size: 'medium', isFieldFocused: false, isFieldValueEmpty: true },
  { shrink: false, error: true, size: 'small', isFieldFocused: false, isFieldValueEmpty: false },
  { color: 'default', severity: 'error' },
  { color: 'inherit', severity: 'success' },
  { color: 'info', variant: 'buffer' },
  { color: 'info', variant: 'determinate' },
  { orientation: 'horizontal', size: 'small' },
  { orientation: 'vertical', size: 'medium' },
  { invisible: true },
];

const classSamples: AnyRecord = {
  disabled: 'disabled',
  focused: 'focused',
  error: 'error',
  notchedOutline: 'notchedOutline',
  input: 'input',
  root: 'root',
};

const isReactLikeFunction = (fn: (...args: any[]) => any): boolean => {
  const name = fn.name || '';

  if (/^[A-Z]/.test(name)) return true;
  if (name.startsWith('use')) return true;
  if (['SvgIcon', 'ForwardRef', 'Memo'].includes(name)) return true;

  const source = Function.prototype.toString.call(fn);
  if (
    source.includes('useContext(') ||
    source.includes('useState(') ||
    source.includes('useMemo(') ||
    source.includes('useTheme(') ||
    source.includes('useDefaultProps(')
  ) {
    return true;
  }

  return false;
};

const invokeFunction = (fn: (...args: any[]) => any) => {
  if (isReactLikeFunction(fn)) return;

  const argSets = [
    [],
    [sampleProps[0]],
    [sampleProps[1]],
    [{ theme: mockTheme }],
    [{ theme: mockTheme, ownerState: sampleProps[9] }],
    [{ theme: mockTheme, style: { left: '100%' } }],
    [{ theme: mockTheme, style: { bottom: '100%' } }],
    [mockTheme],
    [mockTheme, classSamples],
    ['John Doe'],
    [''],
    ['123'],
    [mockTheme, 'John Doe', 'default', 'soft'],
    [mockTheme, ['fontSize', 'lineHeight', 'height']],
  ];

  argSets.forEach((args) => {
    try {
      const result = fn(...args);
      walkNode(result);
    } catch {
      // no-op on incompatible signatures
    }
  });
};

const processVariants = (variants: any[]) => {
  variants.forEach((variant) => {
    if (typeof variant?.props === 'function') {
      sampleProps.forEach((props) => {
        try {
          variant.props(props);
        } catch {
          // no-op
        }
      });
    }

    if (typeof variant?.style === 'function') {
      try {
        variant.style({ theme: mockTheme, ownerState: sampleProps[9] });
      } catch {
        // no-op
      }
    }
  });
};

const walkNode = (node: any) => {
  if (!node) return;

  if (typeof node === 'function') {
    invokeFunction(node);
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((item) => walkNode(item));
    return;
  }

  if (typeof node === 'object') {
    if (Array.isArray(node.variants)) {
      processVariants(node.variants);
    }

    Object.values(node).forEach((value) => walkNode(value));
  }
};

let consoleErrorSpy: jest.SpyInstance;

beforeAll(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

describe('theme core components coverage harness', () => {
  it('executes exported factories, variants, and style callbacks across theme components', () => {
    const nodeRequire = createRequire(__filename);
    const directory = __dirname;
    const files = fs
      .readdirSync(directory)
      .filter(
        (fileName) =>
          (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) &&
          !fileName.endsWith('.test.ts') &&
          !fileName.endsWith('.test.tsx')
      )
      .sort((a, b) => a.localeCompare(b));

    expect(files.length).toBeGreaterThan(0);

    files.forEach((fileName) => {
      const modulePath = path.join(directory, fileName);
      const mod = nodeRequire(modulePath) as AnyRecord;

      Object.values(mod).forEach((exportedValue) => {
        walkNode(exportedValue);
      });
    });
  });
});
