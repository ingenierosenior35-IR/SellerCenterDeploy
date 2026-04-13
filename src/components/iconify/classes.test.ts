import { iconifyClasses } from './classes';

describe('iconify/classes', () => {
  it('exports root class containing iconify token', () => {
    expect(iconifyClasses.root).toContain('iconify__root');
  });
});
