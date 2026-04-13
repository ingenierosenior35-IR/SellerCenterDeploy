import { transitionExit, transitionEnter } from './transition';

describe('transitionEnter', () => {
  it('returns default transition values', () => {
    const result = transitionEnter();
    expect(result.duration).toBe(0.64);
    expect(result.ease).toEqual([0.43, 0.13, 0.23, 0.96]);
  });

  it('merges custom props', () => {
    const result = transitionEnter({ duration: 1, delay: 0.5 });
    expect(result.duration).toBe(1);
    expect(result.delay).toBe(0.5);
    expect(result.ease).toEqual([0.43, 0.13, 0.23, 0.96]);
  });
});

describe('transitionExit', () => {
  it('returns default transition values', () => {
    const result = transitionExit();
    expect(result.duration).toBe(0.48);
    expect(result.ease).toEqual([0.43, 0.13, 0.23, 0.96]);
  });

  it('merges custom props', () => {
    const result = transitionExit({ duration: 0.3 });
    expect(result.duration).toBe(0.3);
    expect(result.ease).toEqual([0.43, 0.13, 0.23, 0.96]);
  });
});
