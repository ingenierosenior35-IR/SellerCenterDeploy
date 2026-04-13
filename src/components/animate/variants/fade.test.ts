import { varFade } from './fade';

describe('varFade', () => {
  it('returns "in" variant with opacity 0 initially', () => {
    const result = varFade('in');
    expect((result.initial as any).opacity).toBe(0);
    expect((result.animate as any).opacity).toBe(1);
    expect((result.exit as any).opacity).toBe(0);
  });

  it('returns "inUp" variant with positive y offset initially', () => {
    const result = varFade('inUp');
    expect((result.initial as any).y).toBe(120);
    expect((result.animate as any).y).toBe(0);
  });

  it('returns "inDown" variant with negative y offset initially', () => {
    const result = varFade('inDown');
    expect((result.initial as any).y).toBe(-120);
  });

  it('returns "inLeft" variant with negative x offset initially', () => {
    const result = varFade('inLeft');
    expect((result.initial as any).x).toBe(-120);
  });

  it('returns "inRight" variant with positive x offset initially', () => {
    const result = varFade('inRight');
    expect((result.initial as any).x).toBe(120);
  });

  it('returns "out" variant starting visible', () => {
    const result = varFade('out');
    expect((result.initial as any).opacity).toBe(1);
    expect((result.animate as any).opacity).toBe(0);
  });

  it('returns "outUp" variant with negative y in animate', () => {
    const result = varFade('outUp');
    expect((result.animate as any).y).toBe(-120);
  });

  it('uses custom distance', () => {
    const result = varFade('inUp', { distance: 50 });
    expect((result.initial as any).y).toBe(50);
  });

  it('merges transitionIn options', () => {
    const result = varFade('inUp', { transitionIn: { duration: 0.5 } });
    expect((result.animate as any).transition.duration).toBe(0.5);
  });
});
