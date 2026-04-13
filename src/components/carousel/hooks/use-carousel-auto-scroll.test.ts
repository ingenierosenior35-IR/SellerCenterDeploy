import { act, renderHook } from '@testing-library/react';

import { useCarouselAutoScroll } from './use-carousel-auto-scroll';

function makeMockApi(isPlayingNow = false) {
  const listeners: Record<string, (() => void)[]> = {};
  const autoScroll = {
    isPlaying: jest.fn(() => isPlayingNow),
    play: jest.fn(),
    stop: jest.fn(),
    reset: jest.fn(),
    options: { stopOnInteraction: true },
  };
  const api = {
    plugins: jest.fn(() => ({ autoScroll })),
    on: jest.fn((event: string, handler: () => void) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
      return api;
    }),
  };
  return { api, autoScroll };
}

describe('useCarouselAutoScroll', () => {
  it('returns isPlaying=false when no api', () => {
    const { result } = renderHook(() => useCarouselAutoScroll(undefined));
    expect(result.current.isPlaying).toBe(false);
  });

  it('onClickPlay calls callback after stopping', () => {
    const { api, autoScroll } = makeMockApi();
    const { result } = renderHook(() => useCarouselAutoScroll(api as any));
    const cb = jest.fn();
    act(() => result.current.onClickPlay(cb));
    expect(autoScroll.stop).toHaveBeenCalled();
    expect(cb).toHaveBeenCalled();
  });

  it('onTogglePlay stops when playing', () => {
    const { api, autoScroll } = makeMockApi(true);
    const { result } = renderHook(() => useCarouselAutoScroll(api as any));
    act(() => result.current.onTogglePlay());
    expect(autoScroll.stop).toHaveBeenCalled();
  });

  it('does nothing when no api on toggle', () => {
    const { result } = renderHook(() => useCarouselAutoScroll(undefined));
    expect(() => act(() => result.current.onTogglePlay())).not.toThrow();
  });
});
