import type { Customer } from "src/interfaces/customer/customer.interface";

type InitialsUser = Partial<ICustomer> & {
  firstName?: string;
  lastName?: string;
  displayName?: string;
};

export const getInitials = (user: Readonly<InitialsUser>) => {
  const firstName = user?.firstname ?? user?.firstName ?? '';
  const lastName = user?.lastname ?? user?.lastName ?? '';
  const displayName = user?.displayName ?? '';
  const email = user?.email ?? '';

  if (firstName || lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  if (displayName) {
    const [firstWord = '', secondWord = ''] = displayName.trim().split(/\s+/);
    return `${firstWord.charAt(0)}${secondWord.charAt(0)}`.toUpperCase();
  }

  return (email?.[0] ?? 'U').toUpperCase();
};
