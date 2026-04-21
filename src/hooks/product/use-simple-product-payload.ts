'use client';

import type { MediaGalleryEntryInput, CreateSimpleProductVariables } from 'src/interfaces';

import { useCallback } from 'react';

// ----------------------------------------------------------------------

type SimpleProductFormData = {
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  weight: number;
  stock: number;
  shortDescription: string;
  description: string;
};

type ImageFile = { file: File };

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

/** Construye la entrada de galería de medios para Magento. */
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
 * Hook que encapsula la lógica de armado del payload para crear un producto simple.
 *
 * Convierte los datos del formulario e imágenes en las variables listas
 * para la mutation GraphQL, desacoplando esa lógica de la vista.
 */
export function useSimpleProductPayload() {
  const buildPayload = useCallback(
    async (formData: SimpleProductFormData, images: ImageFile[]): Promise<CreateSimpleProductVariables> => {
      const files = images.map((img) => img.file);
      const base64Images = await Promise.all(files.map(fileToBase64));
      const mediaGallery = buildMediaGallery(files, base64Images, formData.sku);

      return {
        name: formData.name,
        categoryId: String(formData.categoryId),
        sku: String(formData.sku),
        price: Number.parseFloat(String(formData.price)) || 0,
        weight: Number.parseFloat(String(formData.weight)) || 0,
        shortDescription: formData.shortDescription ?? '',
        description: formData.description ?? '',
        stock: Number(formData.stock) || 0,
        mediaGallery,
      };
    },
    []
  );

  return { buildPayload };
}
