'use client';

import { gql } from 'graphql-request';

/**
 * Query GraphQL para obtener la lista completa de atributos de producto desde Magento.
 * Incluye opciones y frontend_input para filtrar los atributos configurables (SELECT).
 */
export const ATTRIBUTES_LIST_QUERY = gql`
  query AttributesList {
    attributesList(entityType: CATALOG_PRODUCT, filters: {}) {
      items {
        code
        label
        frontend_input
        options {
          label
          value
          is_default
        }
      }
    }
  }
`;
