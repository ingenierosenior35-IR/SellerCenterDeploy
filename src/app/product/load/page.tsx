import { CONFIG } from 'src/global-config';

import { ProductListView } from 'src/sections/product/view';
import { ProductLoadView } from 'src/sections/product/view/product-load-view';


// ----------------------------------------------------------------------

export const metadata = { title: `Product create - ${CONFIG.appName}` };

export default function Page() {
  return <ProductLoadView />;
}
