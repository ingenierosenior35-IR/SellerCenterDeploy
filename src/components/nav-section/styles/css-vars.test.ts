jest.mock('minimal-shared/utils', () => ({
  varAlpha: jest.fn(() => 'rgba(0,0,0,0.1)'),
}));

import { createTheme } from '@mui/material/styles';

import { navSectionCssVars } from './css-vars';

const theme = createTheme({ cssVariables: true });

describe('navSectionCssVars', () => {
  it('vertical returns an object with nav CSS vars', () => {
    const vars = navSectionCssVars.vertical(theme);
    expect(typeof vars).toBe('object');
    expect(vars['--nav-item-radius']).toBeDefined();
    expect(vars['--nav-item-root-height']).toBe('44px');
  });

  it('mini returns an object with nav CSS vars', () => {
    const vars = navSectionCssVars.mini(theme);
    expect(typeof vars).toBe('object');
    expect(vars['--nav-item-root-height']).toBe('56px');
  });

  it('horizontal returns an object with nav CSS vars', () => {
    const vars = navSectionCssVars.horizontal(theme);
    expect(typeof vars).toBe('object');
    expect(vars['--nav-height']).toBe('56px');
  });

  it('all variants include --nav-item-color', () => {
    expect(navSectionCssVars.vertical(theme)['--nav-item-color']).toBeDefined();
    expect(navSectionCssVars.mini(theme)['--nav-item-color']).toBeDefined();
    expect(navSectionCssVars.horizontal(theme)['--nav-item-color']).toBeDefined();
  });
});
