// This file contains the TypeScript interfaces for the order detail
// response returned by the GraphQL API.
export interface OrderDetailResponse {
  data: DataDetail;
}

export interface DataDetail {
  sellerOrders: SellerOrdersDetail;
}

export interface SellerOrdersDetail {
  total_count: number;
  user_message: any;
  items: ItemDetail[];
  page_info: PageInfoDetail;
}

export interface ItemDetail {
  status: string;
  created_at: string;
  total: TotalDetail;
  items: OrderItemDetail[];
  order_number: string;
  payment_methods: PaymentMethodDetail[];
  email: string;
  customer_info: CustomerInfoDetail;
  grand_total: number;
  order_date: string;
  shipping_address: AddressDetail;
  order_track_number: string[] | null;
  shipping_method: string;
  shippingDate: string;
  billing_address: AddressDetail;
}
export interface BillingAddressDetail {
  city: string;
  firstname: string;
  lastname: string;
  postcode: string;
  prefix: string;
  region: string;
  street: string[];
  suffix: string;
  telephone: string;
}
export interface TotalDetail {
  grand_total: GrandTotalDetail;
  base_grand_total: BaseGrandTotalDetail;
  pending_balance: any;
  shipping_handling: ShippingHandlingDetail;
  subtotal: SubtotalDetail;
  subtotal_excl_tax: SubtotalExclTaxDetail;
  subtotal_incl_tax: SubtotalInclTaxDetail;
  total_shipping: TotalShippingDetail;
  total_tax: TotalTaxDetail;
  total_store_credit: TotalDetails;
}

// General type for values with currency and value
export interface TotalDetails {
  value: number;
}
export interface GrandTotalDetail {
  value: number;
}

export interface BaseGrandTotalDetail {
  value: number;
}

export interface ShippingHandlingDetail {
  amount_excluding_tax: AmountExcludingTaxDetail;
  amount_including_tax: AmountIncludingTaxDetail;
  discounts: any[];
  taxes: any[];
  total_amount: TotalAmountDetail;
}

export interface AmountExcludingTaxDetail {
  value: number;
}

export interface AmountIncludingTaxDetail {
  value: number;
}

export interface TotalAmountDetail {
  value: number;
}

export interface SubtotalDetail {
  value: number;
}

export interface SubtotalExclTaxDetail {
  value: number;
}

export interface SubtotalInclTaxDetail {
  value: number;
}

export interface TotalShippingDetail {
  value: number;
}

export interface TotalTaxDetail {
  value: number;
}

export interface OrderItemDetail {
  product_sku: string;
  quantity_ordered: number;
  product_image: string;
  product_sale_price: ProductSalePriceDetail;
  product_name: string;
  quantity_invoiced: number;
  selected_options: SelectedOptionDetail[];
}

export interface SelectedOptionDetail {
  label: string;
  value: string;
}

export interface ProductSalePriceDetail {
  value: number;
}

export interface PaymentMethodDetail {
  name: string;
  type: string;
}

export interface CustomerInfoDetail {
  firstname: string;
  lastname: string;
}

export interface AddressDetail {
  city: string;
  firstname: string;
  lastname: string;
  postcode: string;
  prefix: any;
  region: string;
  street: string[];
  suffix: any;
  telephone: string;
}

export interface PageInfoDetail {
  current_page: number;
  page_size: number;
  total_pages: number;
}

// Adapter types

export type DetailAdaptedResponse = DataFormatedDetail;

export interface DataFormatedDetail {
  // id: string | number;
  orderNumber: string;
  status: string;
  createDate: string;
  tracking: string[];
  prices: Prices;
  totalQuantity: number;
  paymentMethodSelected: string;
  customer: CustomerDetail;
  items: OrderRowItemDetail[];
  shipping_method: string;
  shippingDate: string;
  billing_address: BillingAddressDetail;
}

export interface ProductDetail {
  name: string;
  quantityOrdered: number;
  quantityInvoiced: number;
}

export interface CustomerDetail {
  name: string;
  email?: string;
  phone: string;
  shippingAddress: AddressDetail;
}

export interface OrderRowItemDetail {
  id: string | number;
  sku: string;
  name: string;
  quantity: number;
  priceDropshipper: number;
  priceProvider: number;
  coverUrl?: string;
  selected_options: SelectedOptionDetail[];
  product: ProductDetail;
}
export interface Prices {
  grand_total: GrandTotal;
  base_grand_total: BaseGrandTotal;
  pending_balance: any;
  shipping_handling: ShippingHandling;
  subtotal: Subtotal;
  subtotal_excl_tax: SubtotalExclTax;
  subtotal_incl_tax: SubtotalInclTax;
  total_shipping: TotalShipping;
  total_tax: TotalTax;
  total_store_credit: TotalDetails;
}

export interface GrandTotal {
  value: number;
}

export interface BaseGrandTotal {
  value: number;
}

export interface ShippingHandling {
  amount_excluding_tax: AmountExcludingTax;
  amount_including_tax: AmountIncludingTax;
  discounts: any[];
  taxes: any[];
  total_amount: TotalAmount;
}

export interface AmountExcludingTax {
  value: number;
}

export interface AmountIncludingTax {
  value: number;
}

export interface TotalAmount {
  value: number;
}

export interface Subtotal {
  value: number;
}

export interface SubtotalExclTax {
  value: number;
}

export interface SubtotalInclTax {
  value: number;
}

export interface TotalShipping {
  value: number;
}

export interface TotalTax {
  value: number;
}
