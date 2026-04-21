'use client';

import { gql } from 'graphql-request';

/** Mutation GraphQL para crear un producto simple en Magento. */
export const CREATE_SIMPLE_PRODUCT_MUTATION = gql`
  mutation CreateSimpleProduct(
    $name: String!
    $categoryId: String!
    $sku: String!
    $price: Float!
    $weight: Float!
    $shortDescription: String!
    $description: String!
    $stock: Float!
    $mediaGallery: [MediaGalleryEntryInput!]!
  ) {
    createSimpleProduct(
      input: {
        product: {
          name: $name
          attribute_set_id: 4
          sku: $sku
          price: $price
          weight: $weight
          type_id: "simple"
          visibility: 4
          status: 1
          extension_attributes: {
            category_links: [{ position: 0, category_id: $categoryId }]
            stock_item: { qty: $stock, is_in_stock: true }
          }
          custom_attributes: [
            { attribute_code: "description", value: $description }
            { attribute_code: "short_description", value: $shortDescription }
          ]
          media_gallery_entries: $mediaGallery
        }
      }
    ) {
      sku
      success
      message
    }
  }
`;
