import { renderHook } from '@testing-library/react';

import { useFilePreview, revokeObjectUrls } from './use-file-preview';

describe('useFilePreview', () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  it('initializes with empty previewUrl', () => {
    const { result } = renderHook(() => useFilePreview(null));
    expect(result.current.previewUrl).toBe('');
  });

  it('sets previewUrl for string file', () => {
    const { result } = renderHook(() => useFilePreview('https://example.com/file.jpg'));
    expect(result.current.previewUrl).toBe('https://example.com/file.jpg');
  });

  it('creates object URL for File instance', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const { result } = renderHook(() => useFilePreview(file));
    expect(result.current.previewUrl).toBe('blob:mock-url');
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
  });

  it('returns empty previewUrl when file is null', () => {
    const { result } = renderHook(() => useFilePreview(null));
    expect(result.current.previewUrl).toBe('');
  });
});

describe('revokeObjectUrls', () => {
  it('revokes all URLs', () => {
    global.URL.revokeObjectURL = jest.fn();
    revokeObjectUrls(['blob:url1', 'blob:url2']);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:url1');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:url2');
  });

  it('handles empty array', () => {
    global.URL.revokeObjectURL = jest.fn();
    revokeObjectUrls([]);
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
  });
});
