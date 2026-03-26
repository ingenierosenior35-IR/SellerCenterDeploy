import type { GraphQLErrorResponseInterface } from 'src/interfaces/graphql';
import type { ValidateMassUploadResponseInterface } from 'src/interfaces/load/bulk-loading.interface';

export function validateMassUploadAdapter(
  data: ValidateMassUploadResponseInterface | GraphQLErrorResponseInterface | undefined
): ValidateMassUploadResponseInterface {
  if (!data || !('validateMassUpload' in data)) {
    console.warn('Load invalid');
    return {
      validateMassUpload: {
        extension: '',
        file_size_bytes: 0,
        message: 'No data found',
        success: false,
      },
    };
  }

  return {
    validateMassUpload: {
      extension: data.validateMassUpload.extension,
      file_size_bytes: data.validateMassUpload.file_size_bytes,
      message: data.validateMassUpload.message,
      success: data.validateMassUpload.success,
    },
  };
}
