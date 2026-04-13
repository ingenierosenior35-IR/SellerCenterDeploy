jest.mock('./layout', () => ({
  SimpleLayout: () => null,
}));

jest.mock('./content', () => ({
  SimpleContent: () => null,
}));

import * as simple from './index';

describe('simple layout index exports', () => {
  it('exports layout and content modules', () => {
    expect(simple).toBeTruthy();
    expect(simple.SimpleLayout).toBeDefined();
    expect(simple.SimpleContent).toBeDefined();
  });
});
