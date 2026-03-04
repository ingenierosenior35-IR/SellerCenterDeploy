import { CONFIG } from 'src/global-config';

import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Home - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewAppView />;
}
