import { getArrowOffset, getPopoverOrigin } from './utils';

describe('getPopoverOrigin', () => {
  it('returns correct origins for top-left', () => {
    const { anchorOrigin, transformOrigin } = getPopoverOrigin('top-left');
    expect(anchorOrigin).toEqual({ vertical: 'bottom', horizontal: 'left' });
    expect(transformOrigin).toEqual({ vertical: 'top', horizontal: 'left' });
  });

  it('returns correct origins for bottom-right', () => {
    const { anchorOrigin, transformOrigin } = getPopoverOrigin('bottom-right');
    expect(anchorOrigin).toEqual({ vertical: 'top', horizontal: 'right' });
    expect(transformOrigin).toEqual({ vertical: 'bottom', horizontal: 'right' });
  });

  it('flips horizontal for RTL', () => {
    const { anchorOrigin, transformOrigin } = getPopoverOrigin('top-left', true);
    expect(anchorOrigin.horizontal).toBe('right');
    expect(transformOrigin.horizontal).toBe('right');
  });

  it('returns center unchanged in RTL', () => {
    const { anchorOrigin } = getPopoverOrigin('top-center', true);
    expect(anchorOrigin.horizontal).toBe('center');
  });

  it('handles right-center placement', () => {
    const { anchorOrigin, transformOrigin } = getPopoverOrigin('right-center');
    expect(anchorOrigin).toEqual({ vertical: 'center', horizontal: 'left' });
    expect(transformOrigin).toEqual({ vertical: 'center', horizontal: 'right' });
  });
});

describe('getArrowOffset', () => {
  it('calculates offset correctly', () => {
    const anchorRect = { top: 100, left: 100, width: 100, height: 40 };
    const paperRect = { top: 140, left: 90, width: 200, height: 150 };
    const arrowSize = 14;

    const { offsetX, offsetY } = getArrowOffset(anchorRect, paperRect, arrowSize);
    expect(typeof offsetX).toBe('number');
    expect(typeof offsetY).toBe('number');
    expect(offsetX).toBeGreaterThanOrEqual(arrowSize / 2);
    expect(offsetY).toBeGreaterThanOrEqual(arrowSize / 2);
  });

  it('clamps offset within paper bounds', () => {
    const anchorRect = { top: 0, left: 0, width: 10, height: 10 };
    const paperRect = { top: 10, left: 50, width: 100, height: 80 };
    const arrowSize = 14;

    const { offsetX, offsetY } = getArrowOffset(anchorRect, paperRect, arrowSize);
    expect(offsetX).toBeLessThanOrEqual(paperRect.width - arrowSize * 2);
    expect(offsetY).toBeLessThanOrEqual(paperRect.height - arrowSize * 2);
  });
});
