import { act, renderHook } from '@testing-library/react';

import { useCarouselArrows } from './use-carousel-arrows';

function makeMockApi(canScrollPrev = false, canScrollNext = true) {
  const listeners: Record<string, ((api: any) => void)[]> = {};
  const api = {
    canScrollPrev: jest.fn(() => canScrollPrev),
    canScrollNext: jest.fn(() => canScrollNext),
    scrollPrev: jest.fn(),
    scrollNext: jest.fn(),
    on: jest.fn((event: string, handler: (api: any) => void) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
      return api;
    }),
    emit: (event: string) => listeners[event]?.forEach((h) => h(api)),
  };
  return api;
}

describe('useCarouselArrows', () => {
  it('returns initial disabled state when no api', () => {
    const { result } = renderHook(() => useCarouselArrows(undefined));
    expect(result.current.disablePrev).toBe(true);
    expect(result.current.disableNext).toBe(true);
  });

  it('updates state based on api canScroll values', () => {
    const api = makeMockApi(true, true) as any;
    const { result } = renderHook(() => useCarouselArrows(api));
    expect(result.current.disablePrev).toBe(false);
    expect(result.current.disableNext).toBe(false);
  });

  it('scrollPrev is called on onClickPrev', () => {
    const api = makeMockApi() as any;
    const { result } = renderHook(() => useCarouselArrows(api));
    act(() => result.current.onClickPrev());
    expect(api.scrollPrev).toHaveBeenCalled();
  });

  it('scrollNext is called on onClickNext', () => {
    const api = makeMockApi() as any;
    const { result } = renderHook(() => useCarouselArrows(api));
    act(() => result.current.onClickNext());
    expect(api.scrollNext).toHaveBeenCalled();
  });

  it('does nothing on click when no api', () => {
    const { result } = renderHook(() => useCarouselArrows(undefined));
    expect(() => act(() => result.current.onClickPrev())).not.toThrow();
  });
});
