import { renderHook } from '@testing-library/react';

import { useParallax } from './use-carousel-parallax';

describe('useParallax', () => {
  it('returns null when no api', () => {
    const { result } = renderHook(() => useParallax(undefined, undefined));
    expect(result.current).toBeNull();
  });

  it('returns null when parallax is disabled', () => {
    const api = {} as any;
    const { result } = renderHook(() => useParallax(api, undefined));
    expect(result.current).toBeNull();
  });

  it('registers event listeners when api and parallax are provided', () => {
    const on = jest.fn(() => mockApi);
    const mockApi = {
      slideNodes: jest.fn(() => []),
      scrollSnapList: jest.fn(() => []),
      scrollProgress: jest.fn(() => 0),
      slidesInView: jest.fn(() => []),
      internalEngine: jest.fn(() => ({
        options: { loop: false },
        slideRegistry: [],
        slideLooper: { loopPoints: [] },
      })),
      on,
    } as any;
    renderHook(() => useParallax(mockApi, 0.2));
    expect(on).toHaveBeenCalledWith('reInit', expect.any(Function));
  });
});
