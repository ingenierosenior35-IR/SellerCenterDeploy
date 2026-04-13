import React from 'react';
import { render, screen } from '@testing-library/react';

import { CONFIG } from 'src/global-config';

import { defaultSettings } from 'src/components/settings';
import { detectSettings } from 'src/components/settings/server';

import RootLayout, { viewport, metadata } from './layout';

// ---- Mocks ----
jest.mock('src/global.css', () => ({}));

jest.mock('src/global-config', () => ({
  CONFIG: {
    isStaticExport: false,
    assetsDir: '/mock-assets',
  },
}));

jest.mock('src/theme', () => ({
  themeConfig: {
    modeStorageKey: 'mui-mode',
    cssVariables: { colorSchemeSelector: 'data-mui-color-scheme' },
    defaultMode: 'light',
  },
  primary: { main: '#1976d2' },
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

jest.mock('@mui/material/InitColorSchemeScript', () => ({
  __esModule: true,
  default: () => <div data-testid="init-color-scheme-script" />,
}));

jest.mock('@mui/material-nextjs/v15-appRouter', () => ({
  AppRouterCacheProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-router-cache-provider">{children}</div>
  ),
}));

jest.mock('src/components/progress-bar', () => ({
  ProgressBar: () => <div data-testid="progress-bar" />,
}));

jest.mock('src/components/animate/motion-lazy', () => ({
  MotionLazy: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="motion-lazy">{children}</div>
  ),
}));

const detectSettingsMock = detectSettings as jest.Mock;
jest.mock('src/components/settings/server', () => ({
  detectSettings: jest.fn(),
}));

jest.mock('src/components/settings', () => ({
  defaultSettings: { direction: 'ltr' },
  SettingsProvider: ({
    children,
    cookieSettings,
  }: {
    children: React.ReactNode;
    cookieSettings?: unknown;
  }) => (
    <div
      data-testid="settings-provider"
      data-cookie-settings={cookieSettings ? 'yes' : 'no'}
    >
      {children}
    </div>
  ),
  SettingsDrawer: () => <div data-testid="settings-drawer" />,
}));

jest.mock('src/auth/context', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

jest.mock('./providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

describe('src/app/layout.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    CONFIG.isStaticExport = false;
  });

  it('exports viewport correctly', () => {
    expect(viewport).toEqual({
      width: 'device-width',
      initialScale: 1,
      themeColor: '#1976d2',
    });
  });

  it('exports metadata icon using CONFIG.assetsDir', () => {
    expect(metadata.icons).toEqual([
      {
        rel: 'icon',
        url: '/mock-assets/assets/images/logo/favicon.png',
      },
    ]);
  });

  it('renders layout with detectSettings when not static export', async () => {
    detectSettingsMock.mockResolvedValue({ direction: 'rtl' });

    const ui = await RootLayout({ children: <div>child-content</div> });
    render(ui);

    expect(detectSettingsMock).toHaveBeenCalledTimes(1);

    expect(screen.getByTestId('init-color-scheme-script')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('settings-provider')).toHaveAttribute(
      'data-cookie-settings',
      'yes'
    );
    expect(screen.getByTestId('app-router-cache-provider')).toBeInTheDocument();
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('motion-lazy')).toBeInTheDocument();
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    expect(screen.getByTestId('settings-drawer')).toBeInTheDocument();
    expect(screen.getByTestId('providers')).toBeInTheDocument();
    expect(screen.getByText('child-content')).toBeInTheDocument();

    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    expect(document.documentElement).toHaveAttribute('lang', 'en');
  });

  it('uses default direction and no cookieSettings when static export', async () => {
    CONFIG.isStaticExport = true;

    const ui = await RootLayout({ children: <div>static-child</div> });
    render(ui);

    expect(detectSettingsMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('settings-provider')).toHaveAttribute(
      'data-cookie-settings',
      'no'
    );
    expect(document.documentElement).toHaveAttribute('dir', defaultSettings.direction);
    expect(screen.getByText('static-child')).toBeInTheDocument();
  });
});
