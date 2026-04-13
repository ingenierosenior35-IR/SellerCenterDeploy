import { act, renderHook } from '@testing-library/react';

import { useProductUploadDialog } from './use-product-upload-dialog';

const mockValidateCsvFile = jest.fn();
const mockMutateAsync = jest.fn();
const mockFileToBase64 = jest.fn();
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();

jest.mock('src/utils/validate-csv', () => ({
  validateCsvFile: (...args: unknown[]) => mockValidateCsvFile(...args),
}));

jest.mock('src/actions/product/useValidateMassUpload', () => ({
  useValidateMassUpload: () => ({ mutateAsync: mockMutateAsync }),
}));

jest.mock('src/utils/codificateFile', () => ({
  fileToBase64: (...args: unknown[]) => mockFileToBase64(...args),
}));

jest.mock('src/components/snackbar', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

const toFileList = (files: File[]): FileList => {
  const obj: Record<number, File> = {};
  files.forEach((f, i) => {
    obj[i] = f;
  });
  return Object.assign(obj, {
    length: files.length,
    item: (index: number) => files[index] ?? null,
    [Symbol.iterator]: () => files[Symbol.iterator](),
  }) as unknown as FileList;
};

describe('useProductUploadDialog', () => {
  beforeEach(() => {
    mockValidateCsvFile.mockReset();
    mockMutateAsync.mockReset();
    mockFileToBase64.mockReset();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial state', () => {
    it('initializes with expected defaults', () => {
      const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));

      expect(result.current).toMatchObject({
        csvFile: null,
        images: [],
        imagesZip: null,
        disabledUpload: true,
        hasValidImagesChoice: false,
      });
    });
  });

  describe('CSV file handling', () => {
    it('handles csv selection and stores validation errors', async () => {
      const csvFile = new File(['csv content'], 'products.csv', { type: 'text/csv' });

      mockValidateCsvFile.mockResolvedValue(['Error de estructura']);

      const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));

      await act(async () => {
        await result.current.handleCsvFiles(toFileList([csvFile]));
      });

      expect(result.current.csvFile).toEqual(csvFile);
      expect(result.current.csvErrors).toEqual(['Error de estructura']);
      expect(mockValidateCsvFile).toHaveBeenCalledWith(csvFile);
    });

    it('uploads csv successfully and closes dialog', async () => {
      const onClose = jest.fn();
      const csvFile = new File(['a,b'], 'products.csv', { type: 'text/csv' });

      mockFileToBase64.mockResolvedValue('YmFzZTY0');
      mockMutateAsync.mockResolvedValue({
        validateMassUpload: {
          success: true,
          message: 'ok',
        },
      });

      const { result } = renderHook(() => useProductUploadDialog({ onClose }));

      act(() => {
        result.current.setCsvFile(csvFile);
      });

      await act(async () => {
        await result.current.handleUpload();
      });

      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          attributeSetId: 10,
          fileContentBase64: 'YmFzZTY0',
          fileName: 'products',
          fileType: 'csv',
        })
      );
      expect(mockToastSuccess).toHaveBeenCalledWith('Importación completada');
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(result.current.csvFile).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('handles upload error responses', async () => {
      const csvFile = new File(['a,b'], 'products.csv', { type: 'text/csv' });
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      mockFileToBase64.mockResolvedValue('YmFzZTY0');
      mockMutateAsync.mockResolvedValue({
        validateMassUpload: {
          success: false,
          message: 'Carga inválida',
        },
      });

      const { result } = renderHook(() => useProductUploadDialog({ onClose: jest.fn() }));

      act(() => {
        result.current.setCsvFile(csvFile);
      });

      await act(async () => {
        await result.current.handleUpload();
      });

      expect(mockToastError).toHaveBeenCalledWith('Carga inválida');
      expect(result.current.result).toEqual({ ok: false, message: 'Carga inválida' });

      consoleError.mockRestore();
    });
  });
});
