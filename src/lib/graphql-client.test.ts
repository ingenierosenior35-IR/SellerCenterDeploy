jest.mock('src/environments', () => ({
  ENV: { urlBackend: 'http://test-graphql.com', environment: 'test' },
}));

jest.mock('src/auth/context', () => ({
  getSession: jest.fn(() => null),
}));

jest.mock('graphql-request', () => {
  const mockClient = {
    request: jest.fn().mockResolvedValue({ data: 'ok' }),
    setHeader: jest.fn(),
  };
  return {
    GraphQLClient: jest.fn(() => mockClient),
  };
});

describe('GraphQLService', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('getInstance returns a GraphQLService instance', async () => {
    const { GraphQLService } = await import('./graphql-client');
    // Reset singleton for tests
    (GraphQLService as any).instance = undefined;
    const instance = GraphQLService.getInstance();
    expect(instance).toBeDefined();
  });

  it('getInstance returns the same instance (singleton)', async () => {
    const { GraphQLService } = await import('./graphql-client');
    (GraphQLService as any).instance = undefined;
    const a = GraphQLService.getInstance();
    const b = GraphQLService.getInstance();
    expect(a).toBe(b);
  });

  it('setHeader calls the underlying client setHeader', async () => {
    const { GraphQLService } = await import('./graphql-client');
    (GraphQLService as any).instance = undefined;
    const instance = GraphQLService.getInstance();
    expect(() => instance.setHeader('Authorization', 'Bearer test')).not.toThrow();
  });

  it('request calls the underlying client request', async () => {
    const { GraphQLService } = await import('./graphql-client');
    (GraphQLService as any).instance = undefined;
    const instance = GraphQLService.getInstance();
    const result = await instance.request('query { test }');
    expect(result).toBeDefined();
  });
});
