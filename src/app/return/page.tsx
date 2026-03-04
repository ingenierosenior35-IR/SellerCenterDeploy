import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { ReturnListView } from 'src/sections/return/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Return list - ${CONFIG.appName}` };

export default function Page() {
  return <ReturnListView />;
}
