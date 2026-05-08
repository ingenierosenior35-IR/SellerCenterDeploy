// Estados de vinculación del seller en la plataforma.
// Los valores numéricos corresponden a `seller_profile.seller_status`
// devuelto por la query `GetCurrentUser` del backend Magento.

export const SELLER_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  PROCESSING: 'PROCESSING',
  DISABLED: 'DISABLED',
  DENIED: 'DENIED',
} as const;

export type SellerStatus = (typeof SELLER_STATUS)[keyof typeof SELLER_STATUS];

export const SELLER_STATUS_VALUES: SellerStatus[] = Object.values(SELLER_STATUS);

/**
 * Mapeo del entero `seller_status` (Magento) a la representación interna
 * del frontend. Mantener sincronizado con la convención del backend:
 *   0 = Pending     1 = Approved    2 = Processing
 *   3 = Disabled    4 = Denied
 */
export const SELLER_STATUS_BY_CODE: Readonly<Record<number, SellerStatus>> = Object.freeze({
  0: SELLER_STATUS.PENDING,
  1: SELLER_STATUS.APPROVED,
  2: SELLER_STATUS.PROCESSING,
  3: SELLER_STATUS.DISABLED,
  4: SELLER_STATUS.DENIED,
});

export const isSellerStatus = (value: unknown): value is SellerStatus =>
  typeof value === 'string' && (SELLER_STATUS_VALUES as string[]).includes(value);

/**
 * Convierte el entero del backend al enum interno. Devuelve `undefined`
 * cuando el código es desconocido — el consumidor decide el fallback.
 */
export const sellerStatusFromCode = (code: unknown): SellerStatus | undefined => {
  if (typeof code !== 'number') return undefined;
  return SELLER_STATUS_BY_CODE[code];
};
