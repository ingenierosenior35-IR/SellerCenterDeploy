import { CONFIG } from 'src/global-config';

import { ProductCreateConfigurableView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create configurable product - ${CONFIG.appName}` };

export default function Page() {
  return <ProductCreateConfigurableView />;
}
