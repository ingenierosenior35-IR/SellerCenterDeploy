import { CONFIG } from 'src/global-config';

import { ProductCreateSimpleView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create product - ${CONFIG.appName}` };

export default function Page() {
  return <ProductCreateSimpleView />;
}
