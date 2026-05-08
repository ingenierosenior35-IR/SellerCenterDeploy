import type { Customer } from 'src/interfaces/customer/customer.interface';

// ----------------------------------------------------------------------

interface CustomerGQL {
  email?: string | null;
  firstname?: string | null;
  lastname?: string | null;
}

export interface CurrentUserGQLResponse {
  customer: CustomerGQL;
}

// ----------------------------------------------------------------------

export function currentUserAdapter(data: CurrentUserGQLResponse): Customer {
  const { customer } = data;

  return {
    email: customer.email ?? '',
    firstname: customer.firstname ?? '',
    lastname: customer.lastname ?? '',
  } as Customer;
}
