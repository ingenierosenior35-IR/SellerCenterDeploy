'use client';

import type {
  CreateConfigurableProductInput,
  CreateConfigurableProductResponse,
} from 'src/interfaces';

import { GraphQLService } from 'src/lib/graphql-client';

import { checkMultipleSkusExist } from './check-sku-exists';
import { CREATE_CONFIGURABLE_PRODUCT_MUTATION } from './graphql';

/**
 * Envía el input ya armado a la mutation GraphQL de crear producto configurable.
 * La lógica de armado del payload vive en useConfigurableProductPayload.
 */
export async function createConfigurableProduct(input: CreateConfigurableProductInput) {
  // Validar que ningún SKU exista (padre + todos los hijos)
  const allSkus = [
    input.configurableProduct.sku,
    ...input.simpleProducts.map((p) => p.sku),
  ];
  const existingSkus = await checkMultipleSkusExist(allSkus);
  if (existingSkus.length > 0) {
    throw new Error('skuDuplicateError');
  }

  const graphql = GraphQLService.getInstance();

  let result: CreateConfigurableProductResponse;

  try {
    result = await graphql.request<
      CreateConfigurableProductResponse,
      { input: CreateConfigurableProductInput }
    >(CREATE_CONFIGURABLE_PRODUCT_MUTATION, { input });
  } catch (error: unknown) {
    // graphql-request lanza ClientError cuando Magento retorna errors en la respuesta
    throw new Error(sanitizeConfigurableProductError(extractGraphQLError(error)));
  }

  const data = result?.createConfigurableProduct;

  if (!data) {
    throw new Error('errorMessage');
  }

  if (data.status === 'failed') {
    const rawDetails = data.skuStatus
      ?.filter((s) => !s.created)
      .map((s) => s.message)
      .join(' | ');
    throw new Error(sanitizeConfigurableProductError(rawDetails || data.message));
  }

  // Verificar si algún hijo falló individualmente (ej: SKU duplicado en hijos)
  const failedChildren = data.skuStatus?.filter((s) => !s.created);
  if (failedChildren && failedChildren.length > 0) {
    const rawDetails = failedChildren.map((s) => `${s.sku}: ${s.message}`).join(' | ');
    throw new Error(sanitizeConfigurableProductError(rawDetails));
  }

  return {
    status: data.status,
    skuStatus: data.skuStatus,
    message: data.message,
  };
}

/** Extrae el mensaje legible de un error GraphQL (ClientError) o genérico. */
function extractGraphQLError(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const resp = (error as Record<string, any>).response;
    if (resp?.errors?.[0]?.message) {
      return resp.errors[0].message;
    }
  }
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * Sanitiza mensajes de error del backend.
 * Retorna claves de traducción en vez de textos hardcodeados.
 */
function sanitizeConfigurableProductError(message?: string): string {
  if (!message) return 'errorMessage';

  const lowerMsg = message.toLowerCase();

  // SKU duplicado — patrones en español e inglés de Magento
  if (
    lowerMsg.includes('already exists') ||
    lowerMsg.includes('sku existente') ||
    lowerMsg.includes('url ya existe') ||
    lowerMsg.includes('llave url') ||
    lowerMsg.includes('duplicate') ||
    lowerMsg.includes('unique constraint') ||
    lowerMsg.includes('is not unique')
  ) {
    return 'skuDuplicateError';
  }

  // Error genérico para cualquier otro caso
  return 'errorMessage';
}
