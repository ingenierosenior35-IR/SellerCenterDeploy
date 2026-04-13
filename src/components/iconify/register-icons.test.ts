const addCollection = jest.fn();

jest.mock('@iconify/react', () => ({
  addCollection: (...args: any[]) => addCollection(...args),
}));

jest.mock('./icon-sets', () => ({
  'solar:home-angle-bold-duotone': { body: '<path />' },
  'carbon:search': { body: '<path />' },
  'eva:arrow-ios-back-fill': { body: '<path />' },
}));

describe('register-icons', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('builds iconSets and allIconNames', async () => {
    const mod = await import('./register-icons');
    expect(mod.iconSets.length).toBeGreaterThan(0);
    expect(mod.allIconNames).toContain('solar:home-angle-bold-duotone');
    expect(mod.allIconNames).toContain('carbon:search');
  });

  it('registerIcons registers collections once only', async () => {
    const mod = await import('./register-icons');

    mod.registerIcons();
    expect(addCollection).toHaveBeenCalled();

    const firstCalls = addCollection.mock.calls.length;
    mod.registerIcons();
    expect(addCollection).toHaveBeenCalledTimes(firstCalls);
  });

  it('sets carbon width/height to 32 and others to 24', async () => {
    const mod = await import('./register-icons');
    mod.registerIcons();

    const payloads = addCollection.mock.calls.map((c) => c[0]);
    const carbon = payloads.find((p) => p.prefix === 'carbon');
    const solar = payloads.find((p) => p.prefix === 'solar');

    expect(carbon.width).toBe(32);
    expect(carbon.height).toBe(32);
    expect(solar.width).toBe(24);
    expect(solar.height).toBe(24);
  });
});
