jest.mock('./layout', () => ({
  MainLayout: () => null,
}));

import * as mainLayout from './index';

describe('main layout index exports', () => {
  it('exports MainLayout', () => {
    expect(mainLayout).toBeTruthy();
    expect(mainLayout.MainLayout).toBeDefined();
  });
});
