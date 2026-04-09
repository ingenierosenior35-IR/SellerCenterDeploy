export function splitName(fullName: string): { firstName: string; lastName: string } {
  if (!fullName) {
    return { firstName: '', lastName: '' };
  }

  const nameParts = fullName.split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return { firstName, lastName };
}
