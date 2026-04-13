jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets', appName: 'Test App', appVersion: '1.0.0' },
}));
jest.mock('src/theme/theme-config', () => ({
  themeConfig: {
    defaultMode: 'light',
    direction: 'ltr',
    fontFamily: { primary: 'Public Sans Variable', secondary: 'Barlow' },
  },
}));

import { defaultSettings, SETTINGS_STORAGE_KEY } from './settings-config';

describe('settings-config', () => {
  it('exports correct SETTINGS_STORAGE_KEY', () => {
    expect(SETTINGS_STORAGE_KEY).toBe('app-settings');
  });

  it('defaultSettings has mode property', () => {
    expect(defaultSettings).toHaveProperty('mode');
  });

  it('defaultSettings has direction property', () => {
    expect(defaultSettings).toHaveProperty('direction');
  });

  it('defaultSettings has navLayout property', () => {
    expect(defaultSettings).toHaveProperty('navLayout');
  });

  it('defaultSettings has compactLayout property', () => {
    expect(defaultSettings).toHaveProperty('compactLayout');
  });

  it('defaultSettings has fontSize property', () => {
    expect(defaultSettings).toHaveProperty('fontSize');
    expect(defaultSettings.fontSize).toBe(16);
  });

  it('defaultSettings has version from CONFIG', () => {
    expect(defaultSettings.version).toBe('1.0.0');
  });
});
