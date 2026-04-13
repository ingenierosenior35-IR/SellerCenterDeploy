describe('env.dev environment', () => {
  it('exports an object with environment and urlBackend keys', async () => {
    const { environment } = await import('./env.dev');
    expect(environment).toHaveProperty('environment');
    expect(environment).toHaveProperty('urlBackend');
  });
});

describe('env.config environment', () => {
  it('exports an object with environment and urlBackend keys', async () => {
    const { environment } = await import('./env.config');
    expect(environment).toHaveProperty('environment');
    expect(environment).toHaveProperty('urlBackend');
  });

  it('uses placeholder strings for config env', async () => {
    const { environment } = await import('./env.config');
    expect(typeof environment.environment).toBe('string');
    expect(typeof environment.urlBackend).toBe('string');
  });
});
