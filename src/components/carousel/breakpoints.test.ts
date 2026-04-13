import { carouselBreakpoints } from './breakpoints';

describe('carouselBreakpoints', () => {
  it('has correct xs breakpoint', () => {
    expect(carouselBreakpoints.xs).toBe('(min-width: 0px)');
  });

  it('has correct sm breakpoint', () => {
    expect(carouselBreakpoints.sm).toBe('(min-width: 600px)');
  });

  it('has correct md breakpoint', () => {
    expect(carouselBreakpoints.md).toBe('(min-width: 900px)');
  });

  it('has correct lg breakpoint', () => {
    expect(carouselBreakpoints.lg).toBe('(min-width: 1200px)');
  });

  it('has correct xl breakpoint', () => {
    expect(carouselBreakpoints.xl).toBe('(min-width: 1536px)');
  });
});
