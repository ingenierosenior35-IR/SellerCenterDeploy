import type { DataDetail } from 'src/interfaces/order';
import type { DetailAdaptedResponse } from 'src/interfaces/order/order-detail';

export function orderDetailsAdapter(response: DataDetail): DetailAdaptedResponse {
  if (!response.sellerOrders.items) {
    console.warn('No se encontraron órdenes para el vendedor.', response);
  }

  const order = response.sellerOrders.items[0];

  const items = order!.items || [];
  const customerName = `${order!.customer_info.firstname} ${order!.customer_info.lastname}`;
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity_ordered || 0), 0);
  // const totalValue = order!.total.grand_total.value;

  return {
    orderNumber: order!.order_number,
    status: order!.status,
    createDate: order!.created_at,
    totalQuantity,
    paymentMethodSelected: order!.payment_methods[0]?.name ?? '',
    billing_address: {
      city: order!.billing_address.city,
      firstname: order!.billing_address.firstname,
      lastname: order!.billing_address.lastname,
      postcode: order!.billing_address.postcode,
      prefix: order!.billing_address.prefix,
      region: order!.billing_address.region,
      street: order!.billing_address.street,
      suffix: order!.billing_address.suffix,
      telephone: order!.billing_address.telephone,
    },
    shipping_method: order!.shipping_method,
    shippingDate: order!.shippingDate,
    customer: {
      // información del cliente
      name: customerName,
      email: order!.email,
      phone: order!.shipping_address.telephone,
      shippingAddress: {
        city: order!.shipping_address.city,
        region: order!.shipping_address.region,
        street: order!.shipping_address.street,
        postcode: order!.shipping_address.postcode,
        firstname: order!.shipping_address.firstname,
        lastname: order!.shipping_address.lastname,
        prefix: order!.shipping_address.prefix,
        suffix: order!.shipping_address.suffix,
        telephone: order!.shipping_address.telephone,
      },
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
    tracking: order!.order_track_number ?? [], // número de seguimiento
    items: order!.items.map((item, index) => ({
      // información de cada producto en la orden
      product: {
        name: item?.product_name ?? '',
        quantityOrdered: item?.quantity_ordered ?? 0,
        quantityInvoiced: item?.quantity_invoiced ?? 0,
      },
      id: item.product_sku || index,
      sku: item.product_sku,
      name: item.product_name,
      quantity: item.quantity_ordered,
      priceDropshipper: item.product_sale_price?.value ?? 0,
      priceProvider: item.product_sale_price?.value ?? 0,
      coverUrl: item.product_image ?? undefined,
      selected_options: item.selected_options || [],
    })),
  };
}
