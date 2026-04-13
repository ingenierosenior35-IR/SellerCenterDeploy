import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { settingIcons } from './icons';
import * as drawerIndex from './index';
import { BaseOption } from './base-option';
import { SettingsDrawer } from './settings-drawer';
import { PresetsOptions } from './presets-options';
import { FullScreenButton } from './fullscreen-button';
import { LargeBlock, SmallBlock, OptionButton } from './styles';
import { FontSizeOptions, FontFamilyOptions } from './font-options';
import { NavColorOptions, NavLayoutOptions } from './nav-layout-option';

const mockedSetMode = jest.fn();
const mockedSetState = jest.fn();
const mockedOnReset = jest.fn();
const mockedOnCloseDrawer = jest.fn();
const mockedColorSchemeState = { colorScheme: 'light', mode: 'light' as 'light' | 'dark' | 'system' };
const mockedSettingsContextState = {
  canReset: true,
  onCloseDrawer: mockedOnCloseDrawer,
  onReset: mockedOnReset,
  openDrawer: true,
  setState: mockedSetState,
  state: {
    compactLayout: false,
    contrast: 'default',
    direction: 'ltr',
    fontFamily: 'Prospero',
    fontSize: 16,
    mode: 'light',
    navColor: 'integrate',
    navLayout: 'vertical',
    primaryColor: 'default',
    version: '1',
  },
};

jest.mock('minimal-shared/utils', () => ({
  createPaletteChannel: (value: Record<string, unknown>) => value,
  hasKeys: (obj: Record<string, unknown>, keys: string[]) => keys.every((key) => key in obj),
  setFont: (value: string) => value,
  varAlpha: (color: string, alpha: number | string) => `rgba(${color}/${alpha})`,
}));

jest.mock('@mui/material/styles', () => {
  const actual = jest.requireActual('@mui/material/styles');
  return {
    ...actual,
    alpha: (color: string, value: number) => `alpha(${color},${value})`,
    useColorScheme: () => ({
      colorScheme: mockedColorSchemeState.colorScheme,
      mode: mockedColorSchemeState.mode,
      setMode: mockedSetMode,
    }),
  };
});

jest.mock('../../iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('../../scrollbar', () => ({
  Scrollbar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../label', () => ({
  Label: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

jest.mock('../context/use-settings-context', () => ({
  useSettingsContext: () => mockedSettingsContextState,
}));

const theme = createTheme({ cssVariables: true } as any);
(theme as any).mixins = {
  ...(theme as any).mixins,
  paperStyles: () => ({}),
};
(theme as any).vars = {
  ...(theme as any).vars,
  palette: {
    ...(theme as any).vars?.palette,
    background: {
      ...((theme as any).vars?.palette?.background ?? {}),
      defaultChannel: '0 0 0',
    },
  },
};

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('settings drawer coverage', () => {
  beforeEach(() => {
    mockedSetMode.mockClear();
    mockedSetState.mockClear();
    mockedOnReset.mockClear();
    mockedOnCloseDrawer.mockClear();
    mockedColorSchemeState.colorScheme = 'light';
    mockedColorSchemeState.mode = 'light';
    mockedSettingsContextState.state.mode = 'light';

    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: null,
    });
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      configurable: true,
      value: jest.fn(),
    });
    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: jest.fn(),
    });
  });

  it('covers full settings drawer and options components', () => {
    mockedColorSchemeState.mode = 'system';
    mockedSettingsContextState.state.mode = 'dark';

    renderWithTheme(
      <SettingsDrawer
        defaultSettings={{
          compactLayout: true,
          contrast: 'high',
          direction: 'rtl',
          fontFamily: 'Inter Variable',
          fontSize: 12,
          mode: 'dark',
          navColor: 'apparent',
          navLayout: 'horizontal',
          primaryColor: 'preset1',
          version: '1',
        }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /reset all/i }));
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    fireEvent.click(screen.getByText('Mode'));
    fireEvent.click(screen.getByText('Contrast'));
    fireEvent.click(screen.getByText('Right to left'));
    fireEvent.click(screen.getByText('Compact'));
    fireEvent.click(screen.getByText('Layout'));
    fireEvent.click(screen.getByText('Color'));
    fireEvent.click(screen.getByText('Family'));
    fireEvent.click(screen.getByText('Size'));
    fireEvent.click(screen.getByText('Presets'));
    fireEvent.click(screen.getByText('Nav'));
    fireEvent.click(screen.getByText('Font'));
    screen.getAllByRole('button').forEach((button) => fireEvent.click(button));
    fireEvent.change(screen.getByRole('slider', { name: /change font size/i }), {
      target: { value: 18 },
    });

    renderWithTheme(
      <BaseOption
        icon={<span>icon</span>}
        label="Custom action"
        onChangeOption={() => {}}
        selected
        tooltip="Info"
        action={<span>custom</span>}
      />
    );

    renderWithTheme(
      <FontFamilyOptions
        icon={<span>font-icon</span>}
        options={['Prospero', 'Inter Variable']}
        sx={{ m: 1 }}
        value="Prospero"
        onChangeOption={() => {}}
      />
    );
    renderWithTheme(
      <FontFamilyOptions
        icon={<span>font-icon</span>}
        options={['Prospero', 'Inter Variable']}
        sx={[{ m: 1 }]}
        value="Prospero"
        onChangeOption={() => {}}
      />
    );

    renderWithTheme(<FontSizeOptions options={[12, 20]} value={16} onChangeOption={() => {}} />);
    renderWithTheme(
      <FontSizeOptions options={[12, 20]} sx={[{ mx: 2 }]} value={16} onChangeOption={() => {}} />
    );

    renderWithTheme(
      <NavLayoutOptions
        options={[
          { icon: <span>v</span>, value: 'vertical' },
          { icon: <span>h</span>, value: 'horizontal' },
          { icon: <span>m</span>, value: 'mini' },
        ]}
        sx={{ p: 1 }}
        value="vertical"
        onChangeOption={() => {}}
      />
    );
    renderWithTheme(
      <NavLayoutOptions
        options={[{ icon: <span>v</span>, value: 'vertical' }]}
        sx={[{ p: 1 }]}
        value="vertical"
        onChangeOption={() => {}}
      />
    );

    renderWithTheme(
      <NavColorOptions
        options={[
          { icon: <span>i</span>, label: 'Integrate', value: 'integrate' },
          { icon: <span>a</span>, label: 'Apparent', value: 'apparent' },
        ]}
        sx={{ p: 1 }}
        value="integrate"
        onChangeOption={() => {}}
      />
    );
    renderWithTheme(
      <NavColorOptions
        options={[{ icon: <span>i</span>, label: 'Integrate', value: 'integrate' }]}
        sx={[{ p: 1 }]}
        value="integrate"
        onChangeOption={() => {}}
      />
    );

    renderWithTheme(
      <PresetsOptions
        icon={<span>preset</span>}
        options={[
          { name: 'default', value: '#111' },
          { name: 'preset1', value: '#222' },
          { name: 'preset2', value: '#333' },
        ]}
        sx={{ p: 1 }}
        value="preset1"
        onChangeOption={() => {}}
      />
    );
    renderWithTheme(
      <PresetsOptions
        icon={<span>preset</span>}
        options={[{ name: 'default', value: '#111' }]}
        sx={[{ p: 1 }]}
        value="default"
        onChangeOption={() => {}}
      />
    );

    renderWithTheme(<LargeBlock canReset onReset={() => {}} title="Block title" tooltip="Block tip" />);
    renderWithTheme(<SmallBlock canReset label="Small label" onReset={() => {}} />);
    renderWithTheme(<OptionButton selected>Option</OptionButton>);
    renderWithTheme(<OptionButton>Option not selected</OptionButton>);
    renderWithTheme(<FullScreenButton />);

    const fullscreenButton = screen.getByRole('button', { name: /fullscreen/i });
    fireEvent.click(fullscreenButton);
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: document.documentElement,
    });
    fireEvent.click(fullscreenButton);

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Block title')).toBeInTheDocument();
    expect(screen.getByText('Small label')).toBeInTheDocument();
    expect(drawerIndex).toBeDefined();
    expect(Object.keys(settingIcons).length).toBeGreaterThan(0);
    expect(mockedSetState).toHaveBeenCalled();
    expect(mockedSetMode).toHaveBeenCalled();
    expect(mockedOnReset).toHaveBeenCalled();
    expect(mockedOnCloseDrawer).toHaveBeenCalled();
  });

  it('covers alternative branches in settings drawer visibility and toggles', () => {
    mockedColorSchemeState.colorScheme = 'dark';
    mockedColorSchemeState.mode = 'dark';
    mockedSettingsContextState.state.mode = 'dark';
    mockedSettingsContextState.state.contrast = 'high';
    mockedSettingsContextState.state.direction = 'rtl';
    mockedSettingsContextState.state.compactLayout = true;
    mockedSettingsContextState.state.navLayout = 'mini';
    mockedSettingsContextState.state.navColor = 'apparent';
    mockedSettingsContextState.state.fontFamily = 'Inter Variable';
    mockedSettingsContextState.state.fontSize = 20;
    mockedSettingsContextState.state.primaryColor = 'preset2';

    renderWithTheme(
      <SettingsDrawer
        defaultSettings={{
          compactLayout: true,
          contrast: 'high',
          direction: 'rtl',
          fontFamily: 'Inter Variable',
          fontSize: 20,
          mode: 'dark',
          navColor: 'apparent',
          navLayout: 'mini',
          primaryColor: 'preset2',
          version: '1',
        }}
      />
    );

    fireEvent.click(screen.getByText('Mode'));
    fireEvent.click(screen.getByText('Contrast'));
    fireEvent.click(screen.getByText('Right to left'));
    fireEvent.click(screen.getByText('Compact'));

    renderWithTheme(
      <SettingsDrawer
        defaultSettings={{
          mode: 'light',
          version: '1',
        } as any}
      />
    );
  });
});
