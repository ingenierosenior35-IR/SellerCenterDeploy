jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: jest.fn(() => [jest.fn(), undefined]),
}));

import { act, renderHook } from '@testing-library/react';

import { useThumbs } from './use-thumbs';

describe('useThumbs', () => {
  it('returns initial selectedIndex 0', () => {
    const { result } = renderHook(() => useThumbs(undefined, undefined));
    expect(result.current.selectedIndex).toBe(0);
  });

  it('returns a thumbsRef', () => {
    const { result } = renderHook(() => useThumbs(undefined));
    expect(result.current.thumbsRef).toBeDefined();
  });

  it('does nothing on onClickThumb when no apis', () => {
    const { result } = renderHook(() => useThumbs(undefined));
    expect(() => act(() => result.current.onClickThumb(1))).not.toThrow();
  });

  it('registers listeners when mainApi is provided', () => {
    const on = jest.fn(() => mockApi);
    const mockApi = {
      selectedScrollSnap: jest.fn(() => 1),
      scrollTo: jest.fn(),
      on,
    } as any;
    renderHook(() => useThumbs(mockApi));
    expect(on).toHaveBeenCalled();
  });
});
