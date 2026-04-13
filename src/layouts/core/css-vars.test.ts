import { createTheme } from '@mui/material/styles';

import { layoutSectionVars } from './css-vars';

describe('layoutSectionVars', () => {
  it('returns layout css variables derived from theme zIndex values', () => {
    const theme = createTheme();

    expect(layoutSectionVars(theme)).toEqual({
      '--layout-nav-zIndex': theme.zIndex.drawer + 1,
      '--layout-nav-mobile-width': '288px',
      '--layout-header-blur': '8px',
      '--layout-header-zIndex': theme.zIndex.appBar + 1,
      '--layout-header-mobile-height': '64px',
      '--layout-header-desktop-height': '72px',
    });
  });
});
