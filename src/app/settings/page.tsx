import { CONFIG } from 'src/global-config';

import { SellerCenterSettingsView } from 'src/sections/settings/view/seller-center-settings-view';

export const metadata = {
  title: `Seller Center Settings | ${CONFIG.appName}`,
};

export default function Page() {
  return <SellerCenterSettingsView />;
}
