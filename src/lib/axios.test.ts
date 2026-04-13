jest.mock('src/global-config', () => ({
  CONFIG: { serverUrl: 'http://test-server.com' },
}));

jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  return {
    create: jest.fn(() => mockAxiosInstance),
    default: { create: jest.fn(() => mockAxiosInstance) },
  };
});

describe('axios lib', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('exports a default axios instance', async () => {
    const mod = await import('./axios');
    expect(mod.default).toBeDefined();
  });

  it('exports fetcher function', async () => {
    const mod = await import('./axios');
    expect(typeof mod.fetcher).toBe('function');
  });

  it('exports endpoints object', async () => {
    const mod = await import('./axios');
    expect(mod.endpoints).toBeDefined();
    expect(mod.endpoints.auth.signIn).toBe('/api/auth/sign-in');
  });

  it('endpoints has product list', async () => {
    const mod = await import('./axios');
    expect(mod.endpoints.product.list).toBe('/api/product/list');
  });
});
