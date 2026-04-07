import type { TableHeadCell } from "src/sections/order/resources/constants";

import { useTranslate } from "src/locales";

export function useOrders() {
      const { translate } = useTranslate();

    const TABLE_ORDER_HEAD: TableHeadCell[] = [
      { id: 'orderNumber', label: translate('ordersModule.table.columns.order'), width: 88 },
      { id: 'name', label: translate('ordersModule.table.columns.customer') },
      { id: 'createdAt', label: translate('ordersModule.table.columns.date'), width: 140 },
      { id: 'totalQuantity', label: translate('ordersModule.table.columns.quality'), width: 88, align: 'center' },
      { id: 'totalAmount', label: translate('ordersModule.table.columns.total'), width: 140 },
      { id: 'status', label: translate('ordersModule.table.columns.status'), width: 110 },
      { id: '', width: 40 },
    ];
    return {
        TABLE_ORDER_HEAD
    }
}