import * as interfacesRoot from './index';
import * as accountInterfaces from './account';
import * as graphqlInterfaces from './graphql';
import * as returnsInterfaces from './returns';

describe('interfaces barrel modules', () => {
  it('loads root and nested barrels without runtime errors', () => {
    expect(interfacesRoot).toBeDefined();
    expect(accountInterfaces).toBeDefined();
    expect(graphqlInterfaces).toBeDefined();
    expect(returnsInterfaces).toBeDefined();
  });
});
