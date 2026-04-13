jest.mock('./searchbar', () => ({
  Searchbar: () => null,
}));
jest.mock('./menu-button', () => ({
  MenuButton: () => null,
}));
jest.mock('./store-button', () => ({
  StoreButton: () => null,
}));
jest.mock('./sign-out-button', () => ({
  SignOutButton: () => null,
}));
jest.mock('./language-popover', () => ({
  LanguagePopover: () => null,
}));
jest.mock('./nav-toggle-button', () => ({
  NavToggleButton: () => null,
}));
jest.mock('./theme-toggle-button', () => ({
  ThemeToggleButton: () => null,
}));
jest.mock('./notifications-drawer', () => ({
  NotificationsDrawer: () => null,
}));

import * as layoutComponents from './index';

describe('layouts components index exports', () => {
  it('exports the expected component modules', () => {
    expect(layoutComponents).toBeTruthy();
    expect(layoutComponents.Searchbar).toBeDefined();
    expect(layoutComponents.MenuButton).toBeDefined();
    expect(layoutComponents.StoreButton).toBeDefined();
    expect(layoutComponents.SignOutButton).toBeDefined();
    expect(layoutComponents.LanguagePopover).toBeDefined();
    expect(layoutComponents.NavToggleButton).toBeDefined();
    expect(layoutComponents.ThemeToggleButton).toBeDefined();
    expect(layoutComponents.NotificationsDrawer).toBeDefined();
  });
});
