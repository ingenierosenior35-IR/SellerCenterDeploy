import { getSlideSize } from './utils';

describe('getSlideSize', () => {
  it('returns "0 0 50%" for slidesToShow=2', () => {
    expect(getSlideSize(2)).toBe('0 0 50%');
  });

  it('returns "0 0 100%" for slidesToShow=1', () => {
    expect(getSlideSize(1)).toBe('0 0 100%');
  });

  it('returns "0 0 33.333...%" for slidesToShow=3', () => {
    expect(getSlideSize(3)).toMatch(/^0 0 33\.3/);
  });

  it('returns "0 0 auto" for "auto"', () => {
    expect(getSlideSize('auto')).toBe('0 0 auto');
  });

  it('returns "0 0 50%" for "50%"', () => {
    expect(getSlideSize('50%')).toBe('0 0 50%');
  });

  it('returns "0 0 200px" for "200px"', () => {
    expect(getSlideSize('200px')).toBe('0 0 200px');
  });

  it('throws for unsupported string values', () => {
    expect(() => getSlideSize('invalid' as any)).toThrow();
  });

  it('processes object values', () => {
    const result = getSlideSize({ xs: 1, md: 2 } as any) as any;
    expect(result.xs).toBe('0 0 100%');
    expect(result.md).toBe('0 0 50%');
  });
});
