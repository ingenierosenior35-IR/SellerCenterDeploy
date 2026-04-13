jest.mock('minimal-shared/hooks', () => ({
  __esModule: true,
  usePopover: () => ({
    open: false,
    anchorEl: null,
    onClose: jest.fn(),
    onOpen: jest.fn(),
  }),
}));

jest.mock('minimal-shared/utils', () => ({
  __esModule: true,
  isExternalLink: (href: string) => href.startsWith('http'),
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (k: string) => k,
  }),
}));

jest.mock('src/routes/components', () => ({
  RouterLink: 'a',
}));

jest.mock('../iconify', () => ({
  Iconify: () => null,
}));

jest.mock('src/theme/core/components/mui-x-data-grid', () => ({
  ExportIcon: () => null,
  FilterIcon: () => null,
  ViewColumnsIcon: () => null,
  EyeIcon: () => null,
  EyeCloseIcon: () => null,
  DensityCompactIcon: () => null,
  DensityStandardIcon: () => null,
  DensityComfortableIcon: () => null,
}));

jest.mock('@mui/x-data-grid', () => ({
  useGridApiContext: () => ({
    current: { getLocaleText: (k: string) => k },
  }),
  ColumnsPanelTrigger: ({ render }: any) => render({}),
  FilterPanelTrigger: ({ render }: any) => render({}, { filterCount: 0 }),
  ExportPrint: ({ children }: any) => children,
  ExportCsv: ({ children }: any) => children,
  QuickFilter: ({ render }: any) => render({}),
  QuickFilterControl: ({ render }: any) => render({}, { value: '' }),
  QuickFilterClear: ({ children }: any) => children,
  GridActionsCellItem: () => null,
  menuItemClasses: { root: 'MuiMenuItem-root' },
}));

import * as customDataGrid from './index';

describe('custom-data-grid index exports', () => {
  it('exports toolbar-core, grid-actions-cell-item and toolbar-extend-settings', () => {
    expect(customDataGrid).toBeTruthy();
    expect(customDataGrid.ToolbarButtonBase).toBeDefined();
    expect(customDataGrid.CustomGridActionsCellItem).toBeDefined();
    expect(customDataGrid.CustomToolbarSettingsButton).toBeDefined();
  });
});
