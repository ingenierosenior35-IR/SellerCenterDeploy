'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { TranslateProvider } from 'src/locales';
import { themeConfig, ThemeProvider } from 'src/theme';
import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';
import { AuthProvider } from 'src/auth/context';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function App({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TranslateProvider>
          <SettingsProvider defaultSettings={defaultSettings}>
            <ThemeProvider
              modeStorageKey={themeConfig.modeStorageKey}
              defaultMode={themeConfig.defaultMode}
            >
              <AuthProvider>
                <MotionLazy>
                  <ProgressBar />
                  <SettingsDrawer defaultSettings={defaultSettings} />
                  <Snackbar />
                  {children}
                </MotionLazy>
              </AuthProvider>
            </ThemeProvider>
          </SettingsProvider>
        </TranslateProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}
