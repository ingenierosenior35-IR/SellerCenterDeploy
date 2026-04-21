'use client';

import { gql } from 'graphql-request';

/** Mutation GraphQL para crear un producto configurable en Magento (padre + hijos en una sola llamada). */
export const CREATE_CONFIGURABLE_PRODUCT_MUTATION = gql`
  mutation CreateConfigurableProduct($input: CreateConfigurableProductInput!) {
    createConfigurableProduct(input: $input) {
      status
      skuStatus {
        sku
        created
        message
      }
      message
    }
  }
`;
