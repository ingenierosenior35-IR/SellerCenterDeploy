'use client';

import { gql } from 'graphql-request';

/**
 * Query GraphQL para obtener las categorías disponibles del catálogo.
 * Anidada manualmente hasta 5 niveles (Magento no soporta fragmentos recursivos).
 */

const CATEGORY_FIELDS = `
  uid
  id
  name
  product_count
`;

/**
 * Genera la query de categorías con N niveles de profundidad anidados.
 * Cada nivel incluye uid, id, name, product_count y children del siguiente nivel.
 */
function buildChildrenQuery(depth: number): string {
  if (depth <= 0) return CATEGORY_FIELDS;
  return `
    ${CATEGORY_FIELDS}
    children {
      ${buildChildrenQuery(depth - 1)}
    }
  `;
}

export const GET_CATEGORIES_QUERY = gql`
  query {
    categories {
      items {
        uid
        children {
          ${buildChildrenQuery(5)}
        }
      }
    }
  }
`;
