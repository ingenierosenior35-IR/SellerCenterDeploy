import { act, renderHook } from '@testing-library/react';

import { useCarouselDots } from './use-carousel-dots';

function makeMockApi(snapList = [0, 0.5, 1], selectedSnap = 0) {
  const listeners: Record<string, ((api: any) => void)[]> = {};
  const api = {
    scrollSnapList: jest.fn(() => snapList),
    selectedScrollSnap: jest.fn(() => selectedSnap),
    scrollTo: jest.fn(),
    on: jest.fn((event: string, handler: (api: any) => void) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
      return api;
    }),
  };
  return api;
}

describe('useCarouselDots', () => {
  it('returns defaults when no api', () => {
    const { result } = renderHook(() => useCarouselDots(undefined));
    expect(result.current.dotCount).toBe(0);
    expect(result.current.scrollSnaps).toEqual([]);
    expect(result.current.selectedIndex).toBe(0);
  });

  it('populates scrollSnaps from api', () => {
    const api = makeMockApi([0, 0.5, 1]) as any;
    const { result } = renderHook(() => useCarouselDots(api));
    expect(result.current.scrollSnaps).toEqual([0, 0.5, 1]);
    expect(result.current.dotCount).toBe(3);
  });

  it('calls scrollTo when onClickDot is called', () => {
    const api = makeMockApi() as any;
    const { result } = renderHook(() => useCarouselDots(api));
    act(() => result.current.onClickDot(2));
    expect(api.scrollTo).toHaveBeenCalledWith(2);
  });

  it('does nothing on click when no api', () => {
    const { result } = renderHook(() => useCarouselDots(undefined));
    expect(() => act(() => result.current.onClickDot(0))).not.toThrow();
  });
});
