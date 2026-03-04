export interface SellerProductsResponseInterface {
  sellerProducts: {
    items: ItemsProducsInterface[];
    total_count: number;
    page_info: PageInfoInterface;
  };
}


export interface ItemsProducsInterface {
  id: number;
  name: string;
  sku: string;
  price_range: PriceRangeInterface;
  categories: ProductCategoryInterface[];
  stock_status: string;
  stock_saleable: number;
  rating_summary: number;
  thumbnail: ThumbnailProductInterface;
};

export interface PriceRangeInterface {
  minimum_price: {
    discount: {
      amount_off: number;
      percent_off: number;
    };
    final_price: {
      currency: string;
      value: number;
    };
    regular_price: {
      currency: string;
      value: number;
    };
  };
};

export interface ProductCategoryInterface {
  uid: string;
  name: string;
};

export interface ThumbnailProductInterface {
  label: string;
  url: string;
};

export interface PageInfoInterface {
  current_page: number;
  page_size: number;
  total_pages: number;
};


export interface ProductListInterface {
  id: number;
  sku: string;
  productName: string;
  thumbnailUrl: string;
  category: string;
  finalPrice: number;
  discount: number;
  discountPercent: number;
  stock: number;
  inStock: boolean;
  rating: number;
};
