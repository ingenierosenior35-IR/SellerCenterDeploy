import { CONFIG } from 'src/global-config';

import { ProductDetailsView } from 'src/sections/product/view';

export const metadata = { title: `Product details - ${CONFIG.appName}` };

type Props = Readonly<{
  params: Promise<{ id?: string }>;
}>;

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const idStr = resolvedParams?.id;
  const productId = idStr ? Number(idStr) : Number.NaN;

  if (!Number.isFinite(productId)) {
    throw new Error(`Invalid product id: ${String(idStr)}`);
  }

  return <ProductDetailsView id={productId} />;
}
