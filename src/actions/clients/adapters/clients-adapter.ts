import type { ClientListData, SellerCustomersResponse } from 'src/interfaces/clients/client-list';

export function clientsAdapter(data: ClientListData | undefined): SellerCustomersResponse {
  if (!data?.sellerCustomers) {
    return {
      message: '',
      success: false,
      total_count: 0,
      data: []
    };
  }
  return data.sellerCustomers;
}
