global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})) as any;

import { renderHook } from '@testing-library/react';

import { useElementRect } from './hooks';

describe('useElementRect', () => {
  it('returns null when element is null', () => {
    const { result } = renderHook(() => useElementRect(null, 'anchor', false));
    expect(result.current).toBeNull();
  });

  it('returns null when open is false', () => {
    const el = document.createElement('div');
    const { result } = renderHook(() => useElementRect(el, 'anchor', false));
    expect(result.current).toBeNull();
  });

  it('returns rect when element is valid and open is true', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 10, left: 20, width: 100, height: 50, right: 120, bottom: 60, x: 20, y: 10, toJSON: () => ({}),
    });

    renderHook(() => useElementRect(el, 'anchor', true));

    document.body.removeChild(el);
  });
});
