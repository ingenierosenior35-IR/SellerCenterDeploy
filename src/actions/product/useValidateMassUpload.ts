'use client';

import type { ProductListInterface, SellerProductsResponseInterface } from 'src/interfaces';

import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { GraphQLService } from 'src/lib/graphql-client';

import { VALIDATE_MASS_UPLOAD_QUERY } from './graphql/mutations/validate-mass-upload';
import { validateMassUploadAdapter } from './adapters/validate-mass-upload-adapter';
import {
  ValidateMassUploadRequestInterface,
  ValidateMassUploadResponseInterface,
} from 'src/interfaces/load/bulk-loading.interface';

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
