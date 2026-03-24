'use client';

import type {
  CreateConfigurableProductInput,
  CreateConfigurableProductPayload,
  CreateConfigurableProductResponse,
} from 'src/interfaces';

import { GraphQLService } from 'src/lib/graphql-client';

import { CREATE_CONFIGURABLE_PRODUCT_MUTATION } from './graphql';

/** Llama a la mutation GraphQL para crear un producto configurable completo. */
export async function createConfigurableProduct(payload: CreateConfigurableProductPayload) {
  const {
    name,
    categoryId,
    sku,
    price,
    weight,
    shortDescription,
    description,
    attributeSetId,
    images = [],
    files = [],
    children,
    configurableAttributes,
    configurableOptions,
  } = payload;

  if (!name || !sku || !categoryId) {
    throw new Error('Faltan campos obligatorios: nombre, sku o categoría');
  }

  if (!children || children.length === 0) {
    throw new Error('Debe agregar al menos una variación');
  }

  // Construye mediaGallery para el producto padre
  const mediaGallery = files.map((file, index) => {
    const label = file?.name?.replace(/\.[^/.]+$/, '') ?? `${sku}-${index}`;
    return {
      media_type: 'image',
      label,
      position: index,
      disabled: false,
      types: index === 0 ? ['image', 'small_image', 'thumbnail'] : ['image'],
      content: {
        base64_encoded_data: images[index] ?? '',
        type: file?.type ?? 'image/png',
        name: file?.name ?? `${label}.png`,
      },
    };
  });

  // Construye los productos hijos (simples)
  const simpleProducts = children.map((child) => {
    const customAttributes: { attribute_code: string; value: string }[] = [
      { attribute_code: 'description', value: description ?? '' },
      { attribute_code: 'short_description', value: shortDescription ?? '' },
    ];

    // Agrega los atributos de variación como custom_attributes
    for (const attr of configurableAttributes) {
      const childValue = child.attributes[attr.name] ?? '';
      customAttributes.push({ attribute_code: attr.name, value: childValue });
    }

    // Usa imágenes individuales del hijo si existen, o las del padre
    const childFiles = child.files ?? [];
    const childImages = child.images ?? [];
    const childMediaGallery =
      childFiles.length > 0
        ? childFiles.map((file, index) => {
            const label = file?.name?.replace(/\.[^/.]+$/, '') ?? `${child.sku}-${index}`;
            return {
              media_type: 'image',
              label,
              position: index,
              disabled: false,
              types: index === 0 ? ['image', 'small_image', 'thumbnail'] : ['image'],
              content: {
                base64_encoded_data: childImages[index] ?? '',
                type: file?.type ?? 'image/png',
                name: file?.name ?? `${label}.png`,
              },
            };
          })
        : mediaGallery;

    return {
      name: child.name,
      attribute_set_id: attributeSetId,
      sku: child.sku,
      price: Number(child.price) || 0,
      type_id: 'simple' as const,
      weight: Number(weight) || 0,
      visibility: 1,
      status: 1,
      extension_attributes: {
        category_links: [{ position: 0, category_id: String(categoryId) }],
        stock_item: { qty: Number(child.stock) || 0, is_in_stock: true },
      },
      custom_attributes: customAttributes,
      media_gallery_entries: childMediaGallery,
    };
  });

  // Construye custom_attributes del padre incluyendo atributos configurables
  const parentCustomAttributes: { attribute_code: string; value: string }[] = [
    { attribute_code: 'description', value: description ?? '' },
    { attribute_code: 'short_description', value: shortDescription ?? '' },
  ];

  // Agregar los atributos configurables al custom_attributes del padre
  // (Magento los requiere para asociar las opciones configurables)
  for (const attr of configurableAttributes) {
    if (attr.values.length > 0) {
      parentCustomAttributes.push({
        attribute_code: attr.name,
        value: attr.values[0],
      });
    }
  }

  // Construye el producto padre (configurable)
  const configurableProduct = {
    name,
    attribute_set_id: attributeSetId,
    sku: String(sku),
    price: Number(price) || 0,
    type_id: 'configurable' as const,
    weight: Number(weight) || 0,
    visibility: 4,
    status: 1,
    extension_attributes: {
      category_links: [{ position: 0, category_id: String(categoryId) }],
      stock_item: { qty: 0, is_in_stock: true },
      configurable_product_options: configurableOptions,
    },
    custom_attributes: parentCustomAttributes,
    media_gallery_entries: mediaGallery.length > 0 ? mediaGallery : null,
  };

  const input: CreateConfigurableProductInput = {
    simpleProducts,
    configurableProduct,
  };

  const graphql = GraphQLService.getInstance();

  const result = await graphql.request<
    CreateConfigurableProductResponse,
    { input: CreateConfigurableProductInput }
  >(CREATE_CONFIGURABLE_PRODUCT_MUTATION, { input });

  const data = result?.createConfigurableProduct;

  if (!data) {
    throw new Error('Error al crear producto configurable');
  }

  if (data.status === 'failed') {
    const rawDetails = data.skuStatus
      ?.filter((s) => !s.created)
      .map((s) => s.message)
      .join(' | ');
    throw new Error(sanitizeConfigurableProductError(rawDetails || data.message));
  }

  return {
    status: data.status,
    skuStatus: data.skuStatus,
    message: data.message,
  };
}

/**
 * Sanitiza mensajes de error del backend para no exponer información sensible.
 * Detecta patrones conocidos y devuelve mensajes amigables.
 */
function sanitizeConfigurableProductError(message?: string): string {
  if (!message) return 'Ocurrió un error al crear el producto configurable. Intenta nuevamente.';

  const lowerMsg = message.toLowerCase();

  // SKU duplicado
  if (lowerMsg.includes('sku existente') || lowerMsg.includes('url ya existe') || lowerMsg.includes('already exists') || lowerMsg.includes('llave url')) {
    return 'Uno o más SKU ingresados ya se encuentran registrados. Por favor verifica los SKU de las variaciones.';
  }

  // Error genérico para cualquier otro caso
  return 'Ocurrió un error al crear el producto configurable. Intenta nuevamente.';
}
