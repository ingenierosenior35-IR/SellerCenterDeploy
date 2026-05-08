import type { SellerStatus } from './seller-status';

/**
 * Perfil del seller normalizado al frontend tras el adapter de
 * `GetCurrentUser`. El backend entrega `seller_status` como entero (0–4);
 * el adapter lo convierte al enum `SellerStatus`. Si el código entero
 * resulta desconocido, `status` queda `undefined` y los consumidores
 * deben tratarlo como estado inválido (el hook `useSellerStatus`
 * cae a `PENDING` por defecto).
 */
export interface SellerProfile {
  sellerId: number;
  /** Enum normalizado (mapeado desde `seller_status` numérico). */
  status?: SellerStatus;
  /** Código original del backend, conservado por trazabilidad/debug. */
  statusCode: number;
  /** Etiqueta legible que envía el backend (localizada o no). */
  statusLabel: string;
  shopUrl: string;
}
