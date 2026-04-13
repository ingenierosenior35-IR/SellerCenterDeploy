import { navSectionClasses } from './classes';

describe('navSectionClasses', () => {
  it('has mini class string', () => {
    expect(typeof navSectionClasses.mini).toBe('string');
    expect(navSectionClasses.mini).toContain('nav__section__mini');
  });

  it('has vertical class string', () => {
    expect(typeof navSectionClasses.vertical).toBe('string');
  });

  it('has horizontal class string', () => {
    expect(typeof navSectionClasses.horizontal).toBe('string');
  });

  it('has item sub-classes', () => {
    expect(typeof navSectionClasses.item.root).toBe('string');
    expect(typeof navSectionClasses.item.icon).toBe('string');
    expect(typeof navSectionClasses.item.title).toBe('string');
  });

  it('has state classes', () => {
    expect(navSectionClasses.state.open).toBe('--open');
    expect(navSectionClasses.state.active).toBe('--active');
    expect(navSectionClasses.state.disabled).toBe('--disabled');
  });

  it('has dropdown sub-classes', () => {
    expect(typeof navSectionClasses.dropdown.root).toBe('string');
    expect(typeof navSectionClasses.dropdown.paper).toBe('string');
  });
});
