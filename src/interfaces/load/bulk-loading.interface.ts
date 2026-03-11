export interface ValidateMassUploadRequestInterface {
  fileContentBase64: string;
  fileName: string;
  fileType: string;
  attributeSetId: number;
}
export interface ValidateMassUploadResponseInterface {
  validateMassUpload: {
    extension: string;
    file_size_bytes: number;
    message: string;
    success: boolean;
  };
}
