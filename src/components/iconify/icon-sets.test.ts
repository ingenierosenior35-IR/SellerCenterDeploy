import allIcons from './icon-sets';

describe('iconify/icon-sets', () => {
  it('exports a non-empty icon map with prefix:name keys', () => {
    const entries = Object.entries(allIcons);

    expect(entries.length).toBeGreaterThan(0);

    entries.forEach(([key, value]) => {
      expect(key).toContain(':');
      expect(value).toBeTruthy();
      expect(typeof value).toBe('object');
    });
  });
});
