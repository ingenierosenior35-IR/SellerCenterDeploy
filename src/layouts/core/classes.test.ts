import { layoutClasses } from './classes';

describe('layoutClasses', () => {
  it('builds prefixed classes for root layout sections', () => {
    expect(layoutClasses.root).toBe('minimal__layout__root');
    expect(layoutClasses.main).toBe('minimal__layout__main');
    expect(layoutClasses.header).toBe('minimal__layout__header');
    expect(layoutClasses.content).toBe('minimal__layout__main__content');
    expect(layoutClasses.sidebarContainer).toBe('minimal__layout__sidebar__container');
  });

  it('builds prefixed classes for nav variants', () => {
    expect(layoutClasses.nav.root).toBe('minimal__layout__nav__root');
    expect(layoutClasses.nav.mobile).toBe('minimal__layout__nav__mobile');
    expect(layoutClasses.nav.vertical).toBe('minimal__layout__nav__vertical');
    expect(layoutClasses.nav.horizontal).toBe('minimal__layout__nav__horizontal');
  });
});
