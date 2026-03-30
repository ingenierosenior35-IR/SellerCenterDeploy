'use client';

import type {
  CreateSimpleProductResponse,
  CreateSimpleProductVariables,
} from 'src/interfaces';

import { GraphQLService } from 'src/lib/graphql-client';

import { CREATE_SIMPLE_PRODUCT_MUTATION } from './graphql';
import { checkSkuExists } from './check-sku-exists';

/**
 * Envía las variables ya armadas a la mutation GraphQL de crear producto simple.
 * La lógica de armado del payload vive en useSimpleProductPayload.
 */
export async function createProduct(variables: CreateSimpleProductVariables) {
  // Validar que el SKU no exista antes de crear
  const skuExists = await checkSkuExists(variables.sku);
  if (skuExists) {
    throw new Error('skuDuplicateError');
  }

  const graphql = GraphQLService.getInstance();

  let result: CreateSimpleProductResponse;

  try {
    result = await graphql.request<CreateSimpleProductResponse, CreateSimpleProductVariables>(
      CREATE_SIMPLE_PRODUCT_MUTATION,
      variables
    );
  } catch (error: unknown) {
    // graphql-request lanza ClientError cuando Magento retorna errors en la respuesta
    throw new Error(sanitizeProductError(extractGraphQLError(error)));
  }

  const data = result?.createSimpleProduct;

  if (!data) {
    throw new Error('errorMessage');
  }

  if (!data.success) {
    throw new Error(sanitizeProductError(data.message));
  }

  return { sku: data.sku || variables.sku, success: true };
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
function sanitizeProductError(message?: string): string {
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
