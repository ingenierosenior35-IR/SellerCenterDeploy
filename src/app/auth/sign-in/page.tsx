import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { SignInView } from 'src/auth/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Sign in - ${CONFIG.appName}` };

export default function Page() {
  return <SignInView />;
}
