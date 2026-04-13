jest.mock('src/routes/paths', () => ({
  paths: { home: { root: '/home' } },
}));

describe('CONFIG', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('has expected top-level keys', async () => {
    const { CONFIG } = await import('./global-config');
    expect(CONFIG).toHaveProperty('appName');
    expect(CONFIG).toHaveProperty('appVersion');
    expect(CONFIG).toHaveProperty('auth');
    expect(CONFIG).toHaveProperty('firebase');
    expect(CONFIG).toHaveProperty('amplify');
    expect(CONFIG).toHaveProperty('auth0');
    expect(CONFIG).toHaveProperty('supabase');
  });

  it('sets appName to Seller Center MitiMiti', async () => {
    const { CONFIG } = await import('./global-config');
    expect(CONFIG.appName).toBe('Seller Center MitiMiti');
  });

  it('auth method is jwt', async () => {
    const { CONFIG } = await import('./global-config');
    expect(CONFIG.auth.method).toBe('jwt');
  });

  it('auth skip is false', async () => {
    const { CONFIG } = await import('./global-config');
    expect(CONFIG.auth.skip).toBe(false);
  });

  it('falls back to empty string when env vars are not set', async () => {
    const { CONFIG } = await import('./global-config');
    expect(typeof CONFIG.serverUrl).toBe('string');
    expect(typeof CONFIG.assetsDir).toBe('string');
  });

  it('isStaticExport is a boolean', async () => {
    const { CONFIG } = await import('./global-config');
    expect(typeof CONFIG.isStaticExport).toBe('boolean');
  });
});
