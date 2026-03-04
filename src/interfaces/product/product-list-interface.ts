
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
