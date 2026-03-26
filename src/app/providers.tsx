'use client';

import type { ReactNode } from 'react';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TranslateProvider } from 'src/locales';

import { Snackbar } from 'src/components/snackbar';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <TranslateProvider>
        {children}
        <Snackbar />
      </TranslateProvider>
    </QueryClientProvider>
  );
}
