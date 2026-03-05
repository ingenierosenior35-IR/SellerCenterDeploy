import { type CustomerInterface } from "../customer.interface";

export interface ReturnListInterface {
  createdAt: string;
  customer: CustomerInterface;
  id: number;
  orderReference: string;
  status: string;
  productsOrder: {
      id: number;
      name: string;
      price: number;
      thumbnail: string;
      quantity: number
  }[];
};


export interface ReturnListResponseInterface {
  customer: {
    returns: {
      total_count: number;
      items: {
          number: string;
          status: string;
          total_refunded_amount: number;
          uid: string;
          items: {
            status: string;
            uid: string;
            quantity: number;
            order_item: {
              id: number;
              product_image: string;
              product_name: string;
              product_sku: string;
            }
          }[];
          created_at: string;
          customer: {
            email: string;
            firstname: string;
            lastname: string;
          }
          order: {
            order_number: string;
          }
      }[];
      page_info: {
        current_page: number;
        page_size: number;
        total_pages: number;
      }
    }
  }
};

export interface ReturnListRequestInterface {
  returns: {
    totalCount: number;
    items: ItemsReturnListInterface[];
  }
  pageInfo: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
  }
};


export interface ItemsReturnListInterface {
    number:string;
    status: string;
    totalRefundedAmount: number;
    uid: string;
    items: {
      status: string;
      uid: string;
      quantity: number;
      orderItem: {
        id: number;
        productImage: string;
        productName: string;
        productSku: string;
      }
    }[];
    customer: {
      email: string;
      name: string;
    }
    createdAt: string;
    order: {
      orderNumber: string;
    }
};
