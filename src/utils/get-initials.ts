import type { ICustomer } from "src/interfaces/customer/customer.interface";


export const getInitials = (user: Readonly<ICustomer>) => {
  const firstName = user?.firstname ?? '';
  const lastName = user?.lastname ?? '';
  const email = user?.email ?? '';
  if (firstName || lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  return (email?.[0] ?? 'U').toUpperCase();
};
