jest.mock('./layout', () => ({
  AuthSplitLayout: () => null,
}));

jest.mock('./content', () => ({
  AuthSplitContent: () => null,
}));

import * as authSplit from './index';

describe('auth-split index exports', () => {
  it('exports layout and content modules', () => {
    expect(authSplit).toBeTruthy();
    expect(authSplit.AuthSplitLayout).toBeDefined();
    expect(authSplit.AuthSplitContent).toBeDefined();
  });
});
