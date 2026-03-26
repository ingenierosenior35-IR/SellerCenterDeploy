import { CONFIG } from 'src/global-config';

import { UserProfileView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

export const metadata = { title: `User profile | Home - ${CONFIG.appName}` };

export default function Page() {
  return <UserProfileView />;
}
