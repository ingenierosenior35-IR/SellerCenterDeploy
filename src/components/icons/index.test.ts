import * as mod from './index';

describe('icons/index exports', () => {
  it('exports all icon components', () => {
    expect(mod.MoonIcon).toBeDefined();
    expect(mod.StoreIcon).toBeDefined();
    expect(mod.SearchIcon).toBeDefined();
    expect(mod.NotificationBellIcon).toBeDefined();
  });
});
