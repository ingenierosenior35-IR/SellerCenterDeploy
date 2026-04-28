import { useSearchParams as useRRSearchParams } from 'react-router';

// ----------------------------------------------------------------------
// Wraps React Router's [params, setParams] tuple so call-sites receive
// a plain URLSearchParams — same as next/navigation's useSearchParams().

export function useSearchParams(): URLSearchParams {
  const [searchParams] = useRRSearchParams();
  return searchParams;
}
