import type { SellerProfile } from 'src/interfaces/seller/seller-profile';

import { sellerStatusFromCode } from 'src/interfaces/seller/seller-status';

// ----------------------------------------------------------------------

interface SellerProfileGQL {
  seller_id?: number | null;
  seller_status?: number | null;
  seller_status_label?: string | null;
  shop_url?: string | null;
}

export interface SellerProfileGQLResponse {
  customer: { seller_profile?: SellerProfileGQL | null } | null;
}

// ----------------------------------------------------------------------

export const sellerProfileAdapter = (
  data: SellerProfileGQLResponse
): SellerProfile | undefined => {
  const raw = data.customer?.seller_profile;
  if (!raw) return undefined;

  const code = raw.seller_status ?? -1;
  return {
    sellerId: raw.seller_id ?? 0,
    status: sellerStatusFromCode(code),
    statusCode: code,
    statusLabel: raw.seller_status_label ?? '',
    shopUrl: raw.shop_url ?? '',
  };
};
