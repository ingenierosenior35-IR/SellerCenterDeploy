
import { CONFIG } from 'src/global-config';

import LoadOptionsView from 'src/sections/product/view/load-options-view';

export const metadata = { title: `Bulk upload - ${CONFIG.appName}` };

export default function ProductLoadListPage() {
  return <LoadOptionsView />;
}
