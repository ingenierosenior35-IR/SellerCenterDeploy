import 'src/global.css';

import type { Metadata, Viewport } from 'next';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { CONFIG } from 'src/global-config';
import { themeConfig, ThemeProvider, primary as primaryColor } from 'src/theme';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { detectSettings } from 'src/components/settings/server';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context';

import { Providers } from './providers';

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primaryColor.main,
};

export const metadata: Metadata = {
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/assets/images/logo/favicon.png`,
    },
  ],
};

// ----------------------------------------------------------------------

type RootLayoutProps = {
  children: React.ReactNode;
};

async function getAppConfig() {
  if (CONFIG.isStaticExport) {
    return {
      cookieSettings: undefined,
      dir: defaultSettings.direction,
    };
  } else {
    const [settings] = await Promise.all([detectSettings()]);

    return {
      cookieSettings: settings,
      dir: settings.direction,
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  const appConfig = await getAppConfig();

  return (
    <html lang="en" dir={appConfig.dir} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          modeStorageKey={themeConfig.modeStorageKey}
          attribute={themeConfig.cssVariables.colorSchemeSelector}
          defaultMode={themeConfig.defaultMode}
        />

<AppRouterCacheProvider options={{ key: 'css' }}>
        <SettingsProvider
          cookieSettings={appConfig.cookieSettings}
          defaultSettings={defaultSettings}
        >
          <ThemeProvider
            modeStorageKey={themeConfig.modeStorageKey}
            defaultMode={themeConfig.defaultMode}
          >
            <Providers>
              <AuthProvider>

                  <MotionLazy>
                    <ProgressBar />
                    <SettingsDrawer defaultSettings={defaultSettings} />
                    {children}
                  </MotionLazy>

              </AuthProvider>
            </Providers>
          </ThemeProvider>
        </SettingsProvider>
                </AppRouterCacheProvider>
      </body>
    </html>
  );
}
