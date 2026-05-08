'use client';

import type {
  QueueMassUploadImportRequestInterface,
  QueueMassUploadImportResponseInterface,
} from 'src/interfaces/load/bulk-loading.interface';

import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';

import { getSession } from 'src/auth/context';

// ----------------------------------------------------------------------
// Endpoint REST que reemplaza al `queueMassUploadImport` de GraphQL.
// La URL se arma sobre el proxy `/api/magento` (configurado en vite.config),
// que apunta a la raíz de Magento definida en `VITE_BACKEND_GRAPHQL_URL`.
// ----------------------------------------------------------------------

const REST_PATH = '/api/magento/rest/V1/import/products';

const buildEndpoint = (profileId: number): string => {
  if (globalThis.window) {
    const url = new URL(`${globalThis.window.location.origin}${REST_PATH}`);
    url.searchParams.append('profile_id', String(profileId));
    return url.toString();
  }
  return `${REST_PATH}?profile_id=${profileId}`;
};

export function useQueueMassUploadImport() {
  const { translate } = useTranslate();

  return useMutation({
    mutationFn: async (
      request: QueueMassUploadImportRequestInterface
    ): Promise<QueueMassUploadImportResponseInterface> => {
      const form = new FormData();
      form.append('profile_id', String(request.profileId));
      form.append('import_mode', request.importMode);
      form.append('csv_file', request.csvFile, request.csvFile.name);
      if (request.imagesZipFile) {
        form.append('images_zip_file', request.imagesZipFile, request.imagesZipFile.name);
      }

      const headers: Record<string, string> = {};
      const token = getSession();
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(buildEndpoint(request.profileId), {
        method: 'POST',
        headers,
        body: form,
      });

      let payload: any = null;
      try {
        payload = await res.json();
      } catch {
        // body vacío o no-JSON
      }

      if (!res.ok) {
        const message = payload?.message || translate('productLoad.queue.failedTitle');
        throw new Error(message);
      }

      return payload as QueueMassUploadImportResponseInterface;
    },
  });
}
