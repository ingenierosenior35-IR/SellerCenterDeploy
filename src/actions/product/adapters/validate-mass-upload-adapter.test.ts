import { validateMassUploadAdapter } from './validate-mass-upload-adapter';

describe('validateMassUploadAdapter', () => {
  it('returns default error object when data is undefined', () => {
    const result = validateMassUploadAdapter(undefined);
    expect(result.validateMassUpload.success).toBe(false);
    expect(result.validateMassUpload.message).toBe('No data found');
    expect(result.validateMassUpload.extension).toBe('');
    expect(result.validateMassUpload.file_size_bytes).toBe(0);
  });

  it('returns default error object when data has no validateMassUpload', () => {
    const result = validateMassUploadAdapter({} as any);
    expect(result.validateMassUpload.success).toBe(false);
  });

  it('maps data correctly when valid', () => {
    const data = {
      validateMassUpload: {
        extension: 'csv',
        file_size_bytes: 1024,
        message: 'OK',
        success: true,
      },
    } as any;
    const result = validateMassUploadAdapter(data);
    expect(result.validateMassUpload.extension).toBe('csv');
    expect(result.validateMassUpload.file_size_bytes).toBe(1024);
    expect(result.validateMassUpload.message).toBe('OK');
    expect(result.validateMassUpload.success).toBe(true);
  });

  it('maps failed upload response correctly', () => {
    const data = {
      validateMassUpload: {
        extension: 'xlsx',
        file_size_bytes: 500,
        message: 'Invalid format',
        success: false,
      },
    } as any;
    const result = validateMassUploadAdapter(data);
    expect(result.validateMassUpload.success).toBe(false);
    expect(result.validateMassUpload.message).toBe('Invalid format');
  });
});
