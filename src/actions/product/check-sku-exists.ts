'use client';

import { GraphQLService } from 'src/lib/graphql-client';

import { CHECK_SKU_EXISTS_QUERY } from './graphql';

// ----------------------------------------------------------------------

type CheckSkuResponse = {
  sellerProducts: {
    total_count: number;
  };
};

/**
 * Verifica si un SKU ya existe en Magento.
 * Retorna true si el SKU ya está en uso.
 */
export async function checkSkuExists(sku: string): Promise<boolean> {
  const graphql = GraphQLService.getInstance();

  try {
    const result = await graphql.request<CheckSkuResponse, { sku: string }>(
      CHECK_SKU_EXISTS_QUERY,
      { sku }
    );
    return (result?.sellerProducts?.total_count ?? 0) > 0;
  } catch {
    // Si falla la consulta, no bloqueamos la creación
    return false;
  }
}

/**
 * Verifica múltiples SKUs en paralelo.
 * Retorna la lista de SKUs que ya existen en Magento.
 */
export async function checkMultipleSkusExist(skus: string[]): Promise<string[]> {
  const uniqueSkus = [...new Set(skus)];
  const results = await Promise.all(
    uniqueSkus.map(async (sku) => ({ sku, exists: await checkSkuExists(sku) }))
  );
  return results.filter((r) => r.exists).map((r) => r.sku);
}
