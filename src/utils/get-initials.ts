import type { IUserProfile } from "src/interfaces";


export const getInitials = (user: Readonly<IUserProfile>) => {
  const firstName = user?.firstName ?? '';
  const lastName = user?.lastName ?? '';
  const email = user?.email ?? '';
  if (firstName || lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  if (user?.displayName) {
    const parts = user.displayName.trim().split(/\s+/);

    return (
      `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase() ||
                (email?.[0] ?? 'U').toUpperCase()
    );
  }

  return (email?.[0] ?? 'U').toUpperCase();
};
