import type { ReturnListRequestInterface, ReturnListResponseInterface } from 'src/interfaces';

import { CONFIG } from 'src/global-config';

export function returnsListAdapter(data: ReturnListResponseInterface): ReturnListRequestInterface {

  if (
    !data ||
    !('customer' in data)
  ) {
      console.warn("No found products");
      return {} as ReturnListRequestInterface;
  }

  const items =  data.customer.returns.items.map((returnItem) => ({
      status: returnItem.status,
      totalRefundedAmount: returnItem.total_refunded_amount,
      uid: returnItem.uid,
      createdAt: returnItem.created_at ?? '',
      items: returnItem.items.map((item) => ({
        status: item.status,
        uid: item.uid,
        quantity: item.quantity ?? 0,
        orderItem: {
          id: item.order_item.id,
          productImage: item.order_item.product_image ?? CONFIG.assetsDir + '/assets/images/img-not-found.jpg',
          productName: item.order_item.product_name ?? '',
          productSku: item.order_item.product_sku ?? ''
        }
      })),
      number: returnItem.number ?? '',
      customer: {
        email: returnItem.customer.email ?? '',
        name: (returnItem.customer.firstname ?? '') + ' ' + (returnItem.customer.lastname ?? ''),
      },
      order: {
        orderNumber: returnItem.order.order_number ?? '',
      }
  }));

  return {
    returns: {
      totalCount: data.customer.returns.total_count,
      items,
    },
    pageInfo: {
      currentPage: data.customer.returns.page_info.current_page,
      pageSize: data.customer.returns.page_info.page_size,
      totalPages: data.customer.returns.page_info.total_pages
    }
  }
}
