'use client';

import { HomeContent } from 'src/layouts/home';
import { useGetOrderDetail } from 'src/actions/order/use-order-details';
import { orderDetailsAdapter } from 'src/actions/order/adapters/order-details-adapter';

import { ErrorContent } from 'src/components/error-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { OrderDetailsView } from './views/order-details-view';

export default function OrderDetailsClient({ orderId }: { orderId: string }) {
  const { data, error, isLoading } = useGetOrderDetail(orderId);

  if (isLoading) {
    return <LoadingScreen sx={{}} slots={{}} slotsProps={{}} />;
  }

  if (error) {
    console.error('Error al cargar detalle orden:', error);

    return (
      <HomeContent>
        <ErrorContent
          title="Orden no disponible"
          description="Lo sentimos, no pudimos cargar la orden en este momento. Por favor, intenta nuevamente más tarde."
          sx={{ mt: 10 }}
          slotProps={{}}
        />
      </HomeContent>
    );
  }

  const order = orderDetailsAdapter(data!);

  if (data !== undefined) {
    return <OrderDetailsView order={order} />;
  }
}
