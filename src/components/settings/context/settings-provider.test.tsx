jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets', appName: 'Test', appVersion: '1.0.0' },
}));
jest.mock('src/theme/theme-config', () => ({
  themeConfig: {
    defaultMode: 'light',
    direction: 'ltr',
    fontFamily: { primary: 'Public Sans Variable', secondary: 'Barlow' },
  },
}));
jest.mock('minimal-shared/utils', () => ({
  getCookie: jest.fn(() => null),
  getStorage: jest.fn(() => null),
}));
jest.mock('minimal-shared/hooks', () => ({
  useLocalStorage: jest.fn((key: string, defaults: any) => ({
    state: defaults,
    setState: jest.fn(),
    resetState: jest.fn(),
    setField: jest.fn(),
  })),
  useCookies: jest.fn((key: string, defaults: any) => ({
    state: defaults,
    setState: jest.fn(),
    resetState: jest.fn(),
    setField: jest.fn(),
  })),
}));
jest.mock('es-toolkit', () => ({
  isEqual: jest.fn(() => true),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { SettingsProvider } from './settings-provider';
import { useSettingsContext } from './use-settings-context';

const defaultSettings = {
  mode: 'light' as const,
  direction: 'ltr' as const,
  contrast: 'default' as const,
  navLayout: 'vertical' as const,
  primaryColor: 'default' as const,
  navColor: 'integrate' as const,
  compactLayout: true,
  fontSize: 16,
  fontFamily: 'Public Sans Variable',
  version: '1.0.0',
};

function TestConsumer() {
  const settings = useSettingsContext();
  return <div data-testid="settings">{settings.state.mode}</div>;
}

describe('SettingsProvider', () => {
  it('provides settings context to children', () => {
    render(
      <SettingsProvider defaultSettings={defaultSettings}>
        <TestConsumer />
      </SettingsProvider>
    );
    expect(screen.getByTestId('settings')).toBeInTheDocument();
    expect(screen.getByTestId('settings').textContent).toBe('light');
  });
});

describe('useSettingsContext', () => {
  it('throws when used outside SettingsProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useSettingsContext());
    }).toThrow('useSettingsContext must be use inside SettingsProvider');
    consoleError.mockRestore();
  });
});

function renderHook<T>(callback: () => T) {
  let result: T;
  function TestHook() {
    result = callback();
    return null;
  }
  const { unmount } = render(<TestHook />);
  return { result: result!, unmount };
}
