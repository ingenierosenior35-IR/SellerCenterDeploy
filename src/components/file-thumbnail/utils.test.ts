jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets', appName: 'Test', appVersion: '1.0.0' },
}));
jest.mock('minimal-shared/utils', () => ({
  uuidv4: jest.fn(() => 'test-uuid'),
}));

import {
  FILE_ICONS,
  getFileName,
  getFileIcon,
  getFileMeta,
  FILE_FORMATS,
  getFileExtension,
  detectFileFormat,
} from './utils';

describe('getFileName', () => {
  it('extracts file name from URL', () => {
    expect(getFileName('https://example.com/docs/file.pdf')).toBe('file.pdf');
  });

  it('strips query string', () => {
    expect(getFileName('https://example.com/file.pdf?v=1')).toBe('file.pdf');
  });

  it('decodes encoded names', () => {
    expect(getFileName('/path/to/file%20name.txt')).toBe('file name.txt');
  });

  it('returns empty string for null/undefined', () => {
    expect(getFileName(null)).toBe('');
    expect(getFileName(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(getFileName('')).toBe('');
  });
});

describe('getFileExtension', () => {
  it('extracts pdf extension', () => {
    expect(getFileExtension('document.pdf')).toBe('pdf');
  });

  it('extracts from MIME type', () => {
    expect(getFileExtension('image/jpeg')).toBe('jpeg');
  });

  it('returns unknown for unrecognized extension', () => {
    expect(getFileExtension('file.xyz123')).toBe('unknown');
  });

  it('returns unknown for null', () => {
    expect(getFileExtension(null)).toBe('unknown');
  });
});

describe('detectFileFormat', () => {
  it('detects image format from jpg', () => {
    expect(detectFileFormat('photo.jpg')).toBe('image');
  });

  it('detects pdf format', () => {
    expect(detectFileFormat('document.pdf')).toBe('pdf');
  });

  it('detects audio format', () => {
    expect(detectFileFormat('track.mp3')).toBe('audio');
  });

  it('detects word format', () => {
    expect(detectFileFormat('doc.docx')).toBe('word');
  });

  it('returns unknown for unknown format', () => {
    expect(detectFileFormat('file.xyz999')).toBe('unknown');
  });
});

describe('getFileIcon', () => {
  it('returns pdf icon URL for pdf file', () => {
    const icon = getFileIcon('document.pdf');
    expect(icon).toContain('ic-pdf.svg');
    expect(icon).toContain('/assets/assets/icons/files/');
  });

  it('returns image icon URL for jpg file', () => {
    const icon = getFileIcon('photo.jpg');
    expect(icon).toContain('ic-img.svg');
  });

  it('returns unknown icon for unrecognized file', () => {
    const icon = getFileIcon('file.xyz999');
    expect(icon).toContain('ic-file.svg');
  });
});

describe('getFileMeta', () => {
  it('returns empty metadata for null', () => {
    const meta = getFileMeta(null);
    expect(meta.name).toBe('');
    expect(meta.size).toBe(0);
    expect(meta.format).toBe('unknown');
  });

  it('returns metadata from string path', () => {
    const meta = getFileMeta('/path/to/image.jpg');
    expect(meta.name).toBe('image.jpg');
    expect(meta.format).toBe('image');
  });

  it('returns metadata from File object', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const meta = getFileMeta(file);
    expect(meta.name).toBe('test.pdf');
    expect(meta.key).toBe('test-uuid');
  });

  it('FILE_FORMATS is defined', () => {
    expect(FILE_FORMATS).toBeDefined();
    expect(FILE_FORMATS.image).toContain('jpg');
  });

  it('FILE_ICONS is defined', () => {
    expect(FILE_ICONS).toBeDefined();
    expect(FILE_ICONS.pdf).toBe('ic-pdf');
  });
});
