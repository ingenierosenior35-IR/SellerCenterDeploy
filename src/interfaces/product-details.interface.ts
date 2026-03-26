export interface ProductDetailsResponseInterface {
  sellerProducts: {
    total_count: number;
    items: ProductDetailsItemInterface[];
  };
}

export interface ProductDetailsItemInterface {
  __typename: string;
  id: number;
  uid: string;
  sku: string;
  name: string;
  stock_status: string;
  stock_saleable: number;
  updated_at: string;
  categories: ProductDetailsCategoryInterface[];
  price_range: ProductDetailsPriceRangeInterface;
  custom_attributes_info: ProductDetailsCustomAttributesInfoInterface;
  image: { url: string };
  media_gallery: ProductDetailsMediaGalleryInterface[];

  configurable_product_options_selection?: {
    configurable_options: ProductDetailsConfigurableOptionInterface[];
  };

  variants?: ProductDetailsVariantInterface[];
}

export interface ProductDetailsCategoryInterface {
  name: string;
  uid: string;
  level: number;
}

export interface ProductDetailsPriceRangeInterface {
  minimum_price: {
    regular_price: { value: number };
    final_price: { value: number };
    discount: { amount_off: number; percent_off: number };
  };
}

export interface ProductDetailsCustomAttributesInfoInterface {
  items: Array<{ code: string; value: string }>;
}

export interface ProductDetailsMediaGalleryInterface {
  disabled: boolean;
  label: string;
  position: number;
  url: string;
}

export interface ProductDetailsConfigurableOptionInterface {
  uid: string;
  label: string;
  frontend_input: string;
  values: Array<{
    label: string;
    is_available: boolean;
    uid: string;
    swatch?: { image_url?: string | null } | null;
  }>;
}

export interface ProductDetailsVariantInterface {
  product: {
    __typename: string;
    id: number;
    uid: string;
    sku: string;
    name: string;
    stock_status: string;
    stock_saleable: number;
    updated_at: string;
    categories: ProductDetailsCategoryInterface[];
    price_range: ProductDetailsPriceRangeInterface;
    custom_attributes_info: ProductDetailsCustomAttributesInfoInterface;
    image: { url: string };
  };
  attributes: Array<{ uid: string }>;
}

export interface ProductDetailsUIInterface {
  id: number;
  sku: string;
  name: string;
  category: string;
  inStock: boolean;
  stock: number;

  price: number;
  priceSale: number | null;
  discount: number;
  discountPercent: number;

  coverUrl: string;
  images: string[];

  shortDescription: string;
  description: string;
  weight: string | null;

  configurableOptions: ProductDetailsConfigurableOptionInterface[];
  variants: ProductDetailsVariantInterface[];
}
