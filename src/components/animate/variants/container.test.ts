import { varContainer } from './container';

describe('varContainer', () => {
  it('returns default container variants', () => {
    const result = varContainer();
    expect(result.animate).toBeDefined();
    expect((result.animate as any).transition.staggerChildren).toBe(0.05);
    expect((result.animate as any).transition.delayChildren).toBe(0.05);
    expect(result.exit).toBeDefined();
    expect((result.exit as any).transition.staggerChildren).toBe(0.05);
    expect((result.exit as any).transition.staggerDirection).toBe(-1);
  });

  it('merges transitionIn options', () => {
    const result = varContainer({ transitionIn: { delayChildren: 0.2 } });
    expect((result.animate as any).transition.delayChildren).toBe(0.2);
  });

  it('merges transitionOut options', () => {
    const result = varContainer({ transitionOut: { staggerDirection: 1 } });
    expect((result.exit as any).transition.staggerDirection).toBe(1);
  });
});
