jest.mock('./iconify', () => ({ Iconify: () => null }));
jest.mock('./register-icons', () => ({
  registerIcons: () => {},
  iconSets: [],
  allIconNames: [],
}));

import * as mod from './index';

describe('iconify/index exports', () => {
  it('exports key modules', () => {
    expect(mod).toBeTruthy();
    expect(mod.Iconify).toBeDefined();
    expect(mod.registerIcons).toBeDefined();
  });
});
