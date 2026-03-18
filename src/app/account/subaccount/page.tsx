import { CONFIG } from 'src/global-config';

import { SubAccountListView } from 'src/sections/sub-account/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Subaccount list - ${CONFIG.appName}` };

export default function Page() {
  return <SubAccountListView />;
}
