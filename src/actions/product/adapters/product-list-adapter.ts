import type { LangCode } from 'src/locales';
import type { GraphQLErrorResponseInterface } from 'src/interfaces/graphql';
import type { ProductListInterface, SellerProductsResponseInterface } from 'src/interfaces';

import { CONFIG } from 'src/global-config';
import { DEFAULT_LANG } from 'src/locales';

export function productListAdapter(
  data: SellerProductsResponseInterface
  | GraphQLErrorResponseInterface
  | undefined,
  lang: LangCode
): ProductListInterface[] {

  if (
    !data ||
    !('sellerProducts' in data) ||
    !data?.sellerProducts?.items
  ) {
      console.warn("No found products");
      return [];
  }

  return data.sellerProducts.items.map((product) => ({
      id: product.id,
      sku: product.sku,
      productName: (lang !== DEFAULT_LANG ? product.custom_attributes_info.items[0]?.value : undefined) || product.name,
      thumbnailUrl: product.thumbnail?.url ?? CONFIG.assetsDir + '/assets/images/img-not-found.jpg',
      category: product.categories?.[0]?.name ?? "-",
      finalPrice: product.price_range?.minimum_price?.regular_price?.value ?? 0,
      discount: product.price_range?.minimum_price?.discount?.amount_off ?? 0,
      discountPercent: product.price_range?.minimum_price?.discount?.percent_off ?? 0,
      stock: product.stock_saleable ?? 0,
      inStock: product.stock_status === "IN_STOCK",
      rating: product.rating_summary ?? 0
  }));
}
