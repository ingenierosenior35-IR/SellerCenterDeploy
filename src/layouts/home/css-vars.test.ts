import { createTheme } from '@mui/material/styles';

import { dashboardLayoutVars } from './css-vars';

jest.mock('src/components/nav-section', () => ({
  bulletColor: { dark: '#111111' },
}));

const mockVarAlpha = jest.fn((channel: string, opacity: number) => `rgba(${channel}/${opacity})`);

jest.mock('minimal-shared/utils', () => ({
  varAlpha: (...args: unknown[]) => mockVarAlpha(...args),
}));

const getDashboardNavColorVars = async () => {
  const module = await import('./css-vars');
  return module.dashboardNavColorVars;
};

describe('dashboard css vars', () => {
  it('returns dashboard layout variables', () => {
    const theme = createTheme({ cssVariables: true });

    expect(dashboardLayoutVars(theme)).toEqual({
      '--layout-transition-easing': 'linear',
      '--layout-transition-duration': '120ms',
      '--layout-nav-mini-width': '88px',
      '--layout-nav-vertical-width': '300px',
      '--layout-nav-horizontal-height': '64px',
      '--layout-dashboard-content-pt': theme.spacing(1),
      '--layout-dashboard-content-pb': theme.spacing(8),
      '--layout-dashboard-content-px': theme.spacing(5),
    });
  });

  it('returns integrate and apparent navigation color variables', () => {
    const theme = createTheme({ cssVariables: true });
    const applyStylesSpy = jest.spyOn(theme, 'applyStyles').mockReturnValue({});
    mockVarAlpha.mockClear();

    return getDashboardNavColorVars().then((dashboardNavColorVars) => {
      const integrateVars = dashboardNavColorVars(theme, 'integrate', 'vertical');
      expect(integrateVars.layout).toEqual(
        expect.objectContaining({
          '--layout-nav-bg': theme.vars.palette.background.default,
          '--layout-nav-border-color': expect.any(String),
        })
      );
      expect(integrateVars.section).toBeUndefined();

      const apparentVars = dashboardNavColorVars(theme, 'apparent', 'vertical');
      expect(apparentVars.layout).toEqual(
        expect.objectContaining({
          '--layout-nav-bg': theme.vars.palette.grey[900],
        })
      );
      expect(apparentVars.section).toEqual(
        expect.objectContaining({
          '--nav-item-sub-active-color': theme.vars.palette.common.white,
        })
      );
      expect(mockVarAlpha).toHaveBeenCalled();
      expect(applyStylesSpy).toHaveBeenCalled();
      applyStylesSpy.mockRestore();
    });
  });

  it('throws for unsupported nav color', async () => {
    const theme = createTheme({ cssVariables: true });
    const dashboardNavColorVars = await getDashboardNavColorVars();

    expect(() => dashboardNavColorVars(theme, 'invalid' as any)).toThrow('Invalid color: invalid');
  });
});
