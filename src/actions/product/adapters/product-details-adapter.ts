import type { GraphQLErrorResponseInterface } from 'src/interfaces/graphql';
import type {
  ProductDetailsUIInterface,
  ProductDetailsItemInterface,
  ProductDetailsResponseInterface,
} from 'src/interfaces';

import { CONFIG } from 'src/global-config';

function getCustomAttr(item: ProductDetailsItemInterface, code: string): string | null {
  const found = item.custom_attributes_info?.items?.find((x) => x.code === code);
  return found?.value ?? null;
}

export function productDetailsAdapter(
  data: ProductDetailsResponseInterface | GraphQLErrorResponseInterface | undefined
): ProductDetailsUIInterface | null {
  if (!data || !('sellerProducts' in data) || !data.sellerProducts?.items?.length) {
    console.warn('No found product details');
    return null;
  }

  const product = data.sellerProducts.items[0];

  const coverUrl =
    product.image?.url ?? `${CONFIG.assetsDir}/assets/images/img-not-found.jpg`;

  const gallery = product.media_gallery?.filter((g) => !g.disabled).map((g) => g.url) ?? [];
  const images = gallery.length ? gallery : [coverUrl];

  const description = getCustomAttr(product, 'description') ?? '';
  const shortDescription = getCustomAttr(product, 'short_description') ?? '';
  const weight = getCustomAttr(product, 'weight');

  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    category: product.categories?.[0]?.name ?? '-',
    inStock: product.stock_status === 'IN_STOCK',
    stock: product.stock_saleable ?? 0,

    price: product.price_range?.minimum_price?.final_price?.value ?? 0,
    priceSale: null,
    discount: product.price_range?.minimum_price?.discount?.amount_off ?? 0,
    discountPercent: product.price_range?.minimum_price?.discount?.percent_off ?? 0,

    coverUrl,
    images,

    shortDescription,
    description,
    weight,

    configurableOptions:
      product.configurable_product_options_selection?.configurable_options ?? [],
    variants: product.variants ?? [],
  };
}
