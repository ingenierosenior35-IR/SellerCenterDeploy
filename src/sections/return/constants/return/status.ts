'use client';

import { useTranslate } from 'src/locales/langs/i18n';

export const RETURN_STATUS_VALUES = [
  { value: 'PENDING', color: 'default' },
  { value: 'UNCONFIRMED', color: 'warning' },
  { value: 'AUTHORIZED', color: 'info' },
  { value: 'PARTIALLY_AUTHORIZED', color: 'warning' },
  { value: 'RECEIVED', color: 'success' },
  { value: 'PARTIALLY_RECEIVED', color: 'warning' },
  { value: 'APPROVED', color: 'success' },
  { value: 'PARTIALLY_APPROVED', color: 'warning' },
  { value: 'REJECTED', color: 'error' },
  { value: 'PARTIALLY_REJECTED', color: 'warning' },
  { value: 'DENIED', color: 'error' },
  { value: 'PROCESSED_AND_CLOSED', color: 'success' },
  { value: 'CLOSED', color: 'warning' },
] as const;

export type ReturnStatusValue = (typeof RETURN_STATUS_VALUES)[number]['value'];
export function useReturnStatus() {
  const { translate } = useTranslate();

  return RETURN_STATUS_VALUES.map((s) => ({
    ...s,
    label: translate('returnStatus', s.value),
  }));
}
