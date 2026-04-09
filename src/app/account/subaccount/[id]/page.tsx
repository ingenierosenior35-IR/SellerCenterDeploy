import { CONFIG } from 'src/global-config';

import { SubAccountDetailsView } from 'src/sections/sub-account/view';

export const metadata = { title: `SubAccount details - ${CONFIG.appName}` };

type Props = Readonly<{
  params: Promise<{ id?: string }>;
}>;

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const idStr = resolvedParams?.id;
  const subAccountId = idStr ? Number(idStr) : Number.NaN;

  if (!Number.isFinite(subAccountId)) {
    throw new Error(`Invalid subaccount id: ${String(idStr)}`);
  }

  return <SubAccountDetailsView id={subAccountId} />;
}
