import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { SignUpView } from 'src/auth/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Sign up - ${CONFIG.appName}` };

export default function Page() {
  return <SignUpView />;
}
