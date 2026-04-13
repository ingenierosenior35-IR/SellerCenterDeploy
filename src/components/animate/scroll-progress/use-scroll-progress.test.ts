import * as FramerMotion from 'framer-motion';
import { renderHook } from '@testing-library/react';

import { useScrollProgress } from './use-scroll-progress';

jest.mock('framer-motion', () => ({
  useScroll: jest.fn(() => ({
    scrollYProgress: { value: 0 },
    scrollXProgress: { value: 0 },
  })),
}));

describe('useScrollProgress', () => {
  it('returns elementRef, scrollXProgress and scrollYProgress', () => {
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current.elementRef).toBeDefined();
    expect(result.current.scrollYProgress).toBeDefined();
    expect(result.current.scrollXProgress).toBeDefined();
  });

  it('defaults to document target', () => {
    const useScroll = jest.mocked(FramerMotion.useScroll);
    renderHook(() => useScrollProgress('document'));
    expect(useScroll).toHaveBeenCalledWith(undefined);
  });

  it('uses container ref when target is container', () => {
    const useScroll = jest.mocked(FramerMotion.useScroll);
    renderHook(() => useScrollProgress('container'));
    expect(useScroll).toHaveBeenCalledWith(expect.objectContaining({ container: expect.anything() }));
  });
});
