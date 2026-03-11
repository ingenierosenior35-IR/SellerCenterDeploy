'use client';

import { gql } from 'graphql-request';

export const VALIDATE_MASS_UPLOAD_QUERY = gql`
  mutation ValidateMassUpload($fileContentBase64: String!, $fileName: String!, $fileType: String!, $attributeSetId: Int!) {
    validateMassUpload(
      input: {
        file_content_base64: $fileContentBase64
        file_name: $fileName
        file_type: $fileType
        attribute_set_id: $attributeSetId
      }
    ) {
      extension
      file_size_bytes
      message
      success
    }
  }
`;
