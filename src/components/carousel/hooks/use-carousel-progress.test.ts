import { renderHook } from '@testing-library/react';

import { useCarouselProgress } from './use-carousel-progress';

function makeMockApi(progress = 0.5) {
  const listeners: Record<string, ((api: any) => void)[]> = {};
  const api = {
    scrollProgress: jest.fn(() => progress),
    on: jest.fn((event: string, handler: (api: any) => void) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
      return api;
    }),
  };
  return api;
}

describe('useCarouselProgress', () => {
  it('returns 0 when no api', () => {
    const { result } = renderHook(() => useCarouselProgress(undefined));
    expect(result.current.value).toBe(0);
  });

  it('returns progress as percentage', () => {
    const api = makeMockApi(0.75) as any;
    const { result } = renderHook(() => useCarouselProgress(api));
    expect(result.current.value).toBe(75);
  });

  it('clamps progress to 0-100', () => {
    const apiOver = makeMockApi(1.5) as any;
    const { result: r1 } = renderHook(() => useCarouselProgress(apiOver));
    expect(r1.current.value).toBe(100);

    const apiUnder = makeMockApi(-0.5) as any;
    const { result: r2 } = renderHook(() => useCarouselProgress(apiUnder));
    expect(r2.current.value).toBe(0);
  });
});
