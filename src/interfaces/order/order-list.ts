// This file contains the TypeScript interfaces for the order list

import type { Dayjs } from 'dayjs';
import type { Prices, TotalDetail } from './order-detail';

// Response returned by the GraphQL API.
export interface OrderListResponse {
  data: DataList;
}

export interface DataList {
  sellerOrders: SellerOrdersList;
}

export interface SellerOrdersList {
  total_count: number;
  user_message: any;
  items: ItemList[];
  page_info: PageInfoList;
}

export interface ItemList {
  status: string;
  created_at: string;
  total: TotalDetail;
  items: ItemProductList[];
  order_number: string;
  payment_methods: PaymentMethodList[];
  email: string;
  customer_info: CustomerInfoList;
  grand_total: number;
  order_date: string;
}

export interface GeneralPriceEstructure {
  value: number;
}

export interface GrandTotalList {
  value: number;
}

export interface ItemProductList {
  product_sku: string;
  quantity_ordered: number;
  product_image: any;
  product_sale_price: ProductSalePriceList;
  row_total: number;
  product_name: string;
  quantity_invoiced: number;
}

export interface ProductSalePriceList {
  value: number;
}

export interface PaymentMethodList {
  name: string;
  type: string;
}

export interface CustomerInfoList {
  firstname: string;
  lastname: string;
}

export interface PageInfoList {
  current_page: number;
  page_size: number;
  total_pages: number;
}

// Types for adapted data

export type ResponseFormatedList = DataFormatedList[];

export interface DataFormatedList {
  orderNumber: string;
  status: string;
  createDate: string;
  product: ProductList;
  prices: Prices;
  totalQuantity: number;
  paymentMethodSelected: string;
  customer: CustomerList;
  items: OrderRowItemList[];
}

export interface ProductList {
  name: string;
  quantityOrdered: number;
  quantityInvoiced: number;
}

export interface CustomerList {
  name: string;
  email?: string;
}

export interface OrderRowItemList {
  id: string | number;
  sku: string;
  name: string;
  quantity: number;
  priceDropshipper: number;
  priceProvider: number;
  coverUrl?: string;
}

// Types for filters

export interface FilterModelList {
  name: string;
  status: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}
