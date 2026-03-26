
import type { ICustomer, ICustomerGraphQLResponse } from 'src/interfaces/customer/customer.interface';

export function CustomerAdapter(data: ICustomerGraphQLResponse): ICustomer {
  if (!data || !('customer' in data)) {
    console.warn('No found customer info');
    return {} as ICustomer;
  }

  const addresses = data.customer.addresses ?? [];
  const defaultShipping = addresses.find((addr) => addr.default_shipping) || addresses[0] || null;

  data.customer.addresses = defaultShipping ? [defaultShipping] : addresses[0] ? [addresses[0]] : [];

  return data.customer;
}