import { CONFIG } from 'src/global-config';

import { LandingView } from 'src/sections/international-sellers/view/landing-view';

// ----------------------------------------------------------------------

export const metadata = { title: `International Sellers - ${CONFIG.appName}` };

export default function Page() {
  return <LandingView />;
}
