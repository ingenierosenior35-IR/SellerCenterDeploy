import { CONFIG } from 'src/global-config';

import OrderDetailsClient from 'src/sections/order/order-details-client';

export const metadata = { title: `Detalles de Orden - ${CONFIG.appName}` };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OrderDetailsClient orderId={id} />;
}

