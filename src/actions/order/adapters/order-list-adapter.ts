import type { DataList, ResponseFormatedList } from 'src/interfaces/order';

export function adaptOrderListResponse(response: DataList): ResponseFormatedList {
  if (!response.sellerOrders.items) {
    console.warn('No se encontraron órdenes para el vendedor.', response);

    return [];
  }

  return response.sellerOrders.items.map((order) => {
    const items = order.items || [];
    const customerName = `${order.customer_info.firstname} ${order.customer_info.lastname}`;
    const totalQuantity = items.reduce((sum, item) => sum + (item.quantity_ordered || 0), 0);

    return {
      orderNumber: order.order_number,
      status: order.status,
      createDate: order.created_at,
      product: {
        name: items[0]?.product_name ?? '',
        quantityOrdered: items[0]?.quantity_ordered ?? 0,
        quantityInvoiced: items[0]?.quantity_invoiced ?? 0,
      },
      totalQuantity,
      paymentMethodSelected: order.payment_methods[0]?.name ?? '',
      customer: {
        name: customerName,
        email: order.email,
      },
      prices: {
        base_grand_total: order!.total.base_grand_total,
        grand_total: order!.total.grand_total,
        pending_balance: order?.total.pending_balance ?? null,
        shipping_handling: order!.total.shipping_handling,
        subtotal: order!.total.subtotal,
        subtotal_excl_tax: order!.total.subtotal_excl_tax,
        subtotal_incl_tax: order!.total.subtotal_incl_tax,
        total_shipping: order!.total.total_shipping,
        total_tax: order!.total.total_tax ?? null,
        total_store_credit: order!.total.total_store_credit,
      },
      items: items.map((item, index) => ({
        id: item.product_sku || index,
        sku: item.product_sku,
        name: item.product_name,
        quantity: item.quantity_ordered,
        priceDropshipper: item.product_sale_price?.value ?? item.row_total ?? 0,
        priceProvider: item.product_sale_price?.value ?? item.row_total ?? 0,
        coverUrl: item.product_image ?? undefined,
      })),
    };
  });
}
