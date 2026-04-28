import { useLocation } from 'react-router';

// ----------------------------------------------------------------------
// Thin wrapper so call-sites keep the same string-return signature
// that next/navigation's usePathname() had.

export function usePathname(): string {
  return useLocation().pathname;
}
