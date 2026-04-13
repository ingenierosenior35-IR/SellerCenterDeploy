import { act, renderHook } from '@testing-library/react';

import { useLightbox } from './use-lightbox';

describe('useLightbox', () => {
  const slides = [
    { src: 'image1.jpg' },
    { src: 'image2.jpg' },
    { src: 'image3.jpg' },
  ];

  it('initializes with selected=-1 and open=false', () => {
    const { result } = renderHook(() => useLightbox(slides));
    expect(result.current.selected).toBe(-1);
    expect(result.current.open).toBe(false);
  });

  it('opens lightbox with correct slide index', () => {
    const { result } = renderHook(() => useLightbox(slides));
    act(() => result.current.onOpen('image2.jpg'));
    expect(result.current.selected).toBe(1);
    expect(result.current.open).toBe(true);
  });

  it('sets selected to -1 for unknown url', () => {
    const { result } = renderHook(() => useLightbox(slides));
    act(() => result.current.onOpen('unknown.jpg'));
    expect(result.current.selected).toBe(-1);
    expect(result.current.open).toBe(false);
  });

  it('closes lightbox', () => {
    const { result } = renderHook(() => useLightbox(slides));
    act(() => result.current.onOpen('image1.jpg'));
    expect(result.current.open).toBe(true);
    act(() => result.current.onClose());
    expect(result.current.selected).toBe(-1);
    expect(result.current.open).toBe(false);
  });
});
