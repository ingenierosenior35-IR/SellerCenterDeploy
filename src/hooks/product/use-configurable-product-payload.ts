'use client';

import type {
  ConfigurableChildInput,
  MediaGalleryEntryInput,
  MagentoConfigurableAttribute,
  ConfigurableProductOptionInput,
  CreateConfigurableProductInput,
} from 'src/interfaces';

import { useCallback } from 'react';

// ----------------------------------------------------------------------

type ConfigurableFormData = {
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  weight: number;
  shortDescription: string;
  description: string;
};

type ImageFile = { file: File };

/** Atributo Magento seleccionado por el usuario con los valores elegidos. */
export type SelectedMagentoAttr = {
  attribute: MagentoConfigurableAttribute;
  selectedValues: string[];
};

// ----------------------------------------------------------------------

/** Convierte un File a base64 (sin prefijo data-uri). */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] ?? '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Construye entries de galería de medios para Magento. */
function buildMediaGallery(
  files: File[],
  base64Images: string[],
  sku: string
): MediaGalleryEntryInput[] {
  return files.map((file, index) => {
    const label = file?.name?.replace(/\.[^/.]+$/, '') ?? `${sku}-${index}`;
    return {
      media_type: 'image',
      label,
      position: index,
      disabled: false,
      types: index === 0 ? ['image', 'small_image', 'thumbnail'] : ['image'],
      content: {
        base64_encoded_data: base64Images[index] ?? '',
        type: file?.type ?? 'image/png',
        name: file?.name ?? `${label}.png`,
      },
    };
  });
}

// ----------------------------------------------------------------------

/**
 * Hook que encapsula la lógica de armado del payload para crear un producto configurable.
 *
 * Convierte los datos del formulario, imágenes, variaciones (hijos)
 * y atributos configurables en el input listo para la mutation GraphQL,
 * desacoplando esa lógica de la vista.
 */
export function useConfigurableProductPayload() {
  const buildPayload = useCallback(
    async (
      formData: ConfigurableFormData,
      images: ImageFile[],
      children: ConfigurableChildInput[],
      selectedAttributes: SelectedMagentoAttr[],
      attributeSetId: number
    ): Promise<CreateConfigurableProductInput> => {
      const { name, sku, categoryId, price, weight, shortDescription, description } = formData;

      // Convertir imágenes del padre a base64
      const parentFiles = images.map((img) => img.file);
      const parentBase64 = await Promise.all(parentFiles.map(fileToBase64));
      const parentMediaGallery = buildMediaGallery(parentFiles, parentBase64, sku);

      // Convertir imágenes de cada hijo a base64
      const childrenWithBase64 = await Promise.all(
        children.map(async (child) => {
          if (!child.files || child.files.length === 0) return child;
          const childBase64 = await Promise.all(child.files.map(fileToBase64));
          return { ...child, images: childBase64 };
        })
      );

      // Construir configurableAttributes para mapear atributos en custom_attributes
      const configurableAttributes = selectedAttributes.map((sa) => ({
        name: sa.attribute.code,
        values: sa.selectedValues,
      }));

      // Construir las opciones configurables con datos reales de Magento
      const configurableOptions: ConfigurableProductOptionInput[] = selectedAttributes.map(
        (sa, idx) => ({
          attribute_id: sa.attribute.attribute_id ?? 0,
          label: sa.attribute.label,
          position: idx,
          values: sa.selectedValues.map((v) => ({ value_index: Number(v) })),
        })
      );

      // Construir productos hijos (simples)
      const simpleProducts = childrenWithBase64.map((child) => {
        const customAttributes: { attribute_code: string; value: string }[] = [
          { attribute_code: 'description', value: description ?? '' },
          { attribute_code: 'short_description', value: shortDescription ?? '' },
        ];

        for (const attr of configurableAttributes) {
          const childValue = child.attributes[attr.name] ?? '';
          customAttributes.push({ attribute_code: attr.name, value: childValue });
        }

        // Imágenes del hijo o hereda las del padre
        const childFiles = child.files ?? [];
        const childImages = child.images ?? [];
        const childMediaGallery =
          childFiles.length > 0
            ? buildMediaGallery(childFiles, childImages, child.sku)
            : parentMediaGallery;

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

      // custom_attributes del padre (incluye atributos configurables)
      const parentCustomAttributes: { attribute_code: string; value: string }[] = [
        { attribute_code: 'description', value: description ?? '' },
        { attribute_code: 'short_description', value: shortDescription ?? '' },
      ];

      for (const attr of configurableAttributes) {
        if (attr.values.length > 0) {
          parentCustomAttributes.push({
            attribute_code: attr.name,
            value: attr.values[0],
          });
        }
      }

      // Producto padre (configurable)
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
        media_gallery_entries: parentMediaGallery.length > 0 ? parentMediaGallery : null,
      };

      return { simpleProducts, configurableProduct };
    },
    []
  );

  return { buildPayload };
}
