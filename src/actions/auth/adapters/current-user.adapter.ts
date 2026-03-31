import type { CurrentUserGQLResponse } from '../use-current-user';
import type { ICustomer } from 'src/interfaces/customer/customer.interface';


export function currentUserAdapter(data: CurrentUserGQLResponse): ICustomer {
  const customer = data.customer;

  return {
    email: customer.email ?? '',
    firstname: customer.firstname ?? '',
    lastname: customer.lastname ?? '',
  } as ICustomer;
};
