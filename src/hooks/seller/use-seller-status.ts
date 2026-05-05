'use client';

import { useMemo } from 'react';

import { useSellerProfile } from 'src/actions/auth/use-seller-profile';
import { SELLER_STATUS, type SellerStatus } from 'src/interfaces/seller/seller-status';

// ----------------------------------------------------------------------

/**
 * Hook que expone el estado de vinculación del seller actual.
 *
 * Lee del hook `useSellerProfile` (query independiente del login). Si la
 * query falla, está cargando, o el customer no tiene perfil de seller,
 * devuelve `PENDING` como fallback — esto garantiza que módulos que deben
 * ser accesibles en cualquier estado (como Academy) sigan funcionando.
 */
export const useSellerStatus = (): {
  status: SellerStatus;
  statusLabel: string;
  isApproved: boolean;
  isPending: boolean;
  isProcessing: boolean;
  isDisabled: boolean;
  isDenied: boolean;
} => {
  const { data: profile } = useSellerProfile();

  return useMemo(() => {
    const status: SellerStatus = profile?.status ?? SELLER_STATUS.PENDING;
    const statusLabel = profile?.statusLabel ?? '';

    return {
      status,
      statusLabel,
      isApproved: status === SELLER_STATUS.APPROVED,
      isPending: status === SELLER_STATUS.PENDING,
      isProcessing: status === SELLER_STATUS.PROCESSING,
      isDisabled: status === SELLER_STATUS.DISABLED,
      isDenied: status === SELLER_STATUS.DENIED,
    };
  }, [profile]);
};
