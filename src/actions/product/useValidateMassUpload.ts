'use client';

import type {
  ValidateMassUploadRequestInterface,
  ValidateMassUploadResponseInterface,
} from 'src/interfaces/load/bulk-loading.interface';

import { useMutation } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { VALIDATE_MASS_UPLOAD_QUERY } from './graphql/mutations/validate-mass-upload';

export function useValidateMassUpload() {
  const graphql = GraphQLService.getInstance();
  return useMutation({
    mutationFn: (request: ValidateMassUploadRequestInterface) =>
      graphql.request<ValidateMassUploadResponseInterface, ValidateMassUploadRequestInterface>(
        VALIDATE_MASS_UPLOAD_QUERY,
        request
      ),
  });
}
