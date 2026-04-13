import { act, renderHook } from '@testing-library/react';

import { useCarouselAutoplay } from './use-carousel-autoplay';

function makeMockApi(isPlayingNow = false) {
  const listeners: Record<string, (() => void)[]> = {};
  const autoplay = {
    isPlaying: jest.fn(() => isPlayingNow),
    play: jest.fn(),
    stop: jest.fn(),
    reset: jest.fn(),
    options: { stopOnInteraction: true },
  };
  const api = {
    plugins: jest.fn(() => ({ autoplay })),
    on: jest.fn((event: string, handler: () => void) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
      return api;
    }),
  };
  return { api, autoplay };
}

describe('useCarouselAutoplay', () => {
  it('returns isPlaying=false when no api', () => {
    const { result } = renderHook(() => useCarouselAutoplay(undefined));
    expect(result.current.isPlaying).toBe(false);
  });

  it('initializes isPlaying from plugin state', () => {
    const { api } = makeMockApi(true);
    const { result } = renderHook(() => useCarouselAutoplay(api as any));
    expect(result.current.isPlaying).toBe(true);
  });

  it('onClickPlay calls the callback after stopping', () => {
    const { api, autoplay } = makeMockApi();
    const { result } = renderHook(() => useCarouselAutoplay(api as any));
    const callback = jest.fn();
    act(() => result.current.onClickPlay(callback));
    expect(autoplay.stop).toHaveBeenCalled();
    expect(callback).toHaveBeenCalled();
  });

  it('onTogglePlay calls stop when playing', () => {
    const { api, autoplay } = makeMockApi(true);
    const { result } = renderHook(() => useCarouselAutoplay(api as any));
    act(() => result.current.onTogglePlay());
    expect(autoplay.stop).toHaveBeenCalled();
  });

  it('does nothing when no api on toggle', () => {
    const { result } = renderHook(() => useCarouselAutoplay(undefined));
    expect(() => act(() => result.current.onTogglePlay())).not.toThrow();
  });
});
