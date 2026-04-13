import React from 'react';
import { render, screen, fireEvent, renderHook } from '@testing-library/react';

import {
  useToolbarSettings,
  CustomToolbarSettingsButton,
} from './toolbar-extend-settings';

const onClose = jest.fn();
const onOpen = jest.fn();

jest.mock('minimal-shared/hooks', () => ({
  usePopover: () => ({
    open: true,
    anchorEl: document.body,
    onClose,
    onOpen,
  }),
}));

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (k: string, k2?: string) => (k2 ? `${k}.${k2}` : k),
  }),
}));

jest.mock('src/theme/core/components/mui-x-data-grid', () => ({
  EyeIcon: () => <span data-testid="eye" />,
  EyeCloseIcon: () => <span data-testid="eye-close" />,
  DensityCompactIcon: () => <span data-testid="density-compact-icon" />,
  DensityStandardIcon: () => <span data-testid="density-standard-icon" />,
  DensityComfortableIcon: () => <span data-testid="density-comfortable-icon" />,
}));

jest.mock('../iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('./toolbar-core', () => ({
  ToolbarButtonBase: ({ onClick, label }: any) => (
    <button onClick={onClick} aria-label={label}>
      {label}
    </button>
  ),
}));

describe('useToolbarSettings', () => {
  it('returns default settings and localeText', () => {
    const { result } = renderHook(() => useToolbarSettings());

    expect(result.current.settings.density).toBe('standard');
    expect(result.current.settings.showCellVerticalBorder).toBe(false);
    expect(result.current.settings.showColumnVerticalBorder).toBe(false);
    expect(result.current.settings.localeText!.noRowsLabel).toBe('mui.dataGrid.noRowsLabel');
    expect(typeof result.current.onChangeSettings).toBe('function');
  });

  it('accepts initial settings override', () => {
    const { result } = renderHook(() =>
      useToolbarSettings({ density: 'compact', showCellVerticalBorder: true })
    );

    expect(result.current.settings.density).toBe('compact');
    expect(result.current.settings.showCellVerticalBorder).toBe(true);
  });
});

describe('CustomToolbarSettingsButton', () => {
  it('renders toolbar trigger and settings menu options', () => {
    const onChangeSettings = jest.fn();

    render(
      <CustomToolbarSettingsButton
        showLabel
        settings={{
          density: 'standard',
          showCellVerticalBorder: false,
          showColumnVerticalBorder: true,
          localeText: {},
        }}
        onChangeSettings={onChangeSettings}
      />
    );

    screen.getByLabelText('mui.dataGrid.toolbarSettings')
    expect(screen.getByText('mui.dataGrid.densityCompact')).toBeInTheDocument();
    expect(screen.getByText('mui.dataGrid.densityStandard')).toBeInTheDocument();
    expect(screen.getByText('mui.dataGrid.densityComfortable')).toBeInTheDocument();
    expect(screen.getByText('mui.dataGrid.showColumnBorders')).toBeInTheDocument();
    expect(screen.getByText('mui.dataGrid.showCellBorders')).toBeInTheDocument();
  });

  it('calls onOpen when pressing trigger', () => {
    const onChangeSettings = jest.fn();

    render(
      <CustomToolbarSettingsButton
        showLabel
        settings={{
          density: 'standard',
          showCellVerticalBorder: false,
          showColumnVerticalBorder: false,
          localeText: {},
        }}
        onChangeSettings={onChangeSettings}
      />
    );

    fireEvent.click(screen.getByLabelText('mui.dataGrid.toolbarSettings'));
    expect(onOpen).toHaveBeenCalled();
  });

  it('updates density on menu item click', () => {
    const onChangeSettings = jest.fn();

    render(
      <CustomToolbarSettingsButton
        showLabel={false}
        settings={{
          density: 'standard',
          showCellVerticalBorder: false,
          showColumnVerticalBorder: false,
          localeText: {},
        }}
        onChangeSettings={onChangeSettings}
      />
    );

    fireEvent.click(screen.getByText('mui.dataGrid.densityCompact'));
    expect(onChangeSettings).toHaveBeenCalledTimes(1);

    const updater = onChangeSettings.mock.calls[0][0];
    const next = updater({
      density: 'standard',
      showCellVerticalBorder: false,
      showColumnVerticalBorder: false,
    });
    expect(next.density).toBe('compact');
  });

  it('toggles border settings', () => {
    const onChangeSettings = jest.fn();

    render(
      <CustomToolbarSettingsButton
        showLabel
        settings={{
          density: 'standard',
          showCellVerticalBorder: false,
          showColumnVerticalBorder: true,
          localeText: {},
        }}
        onChangeSettings={onChangeSettings}
      />
    );

    fireEvent.click(screen.getByText('mui.dataGrid.showColumnBorders'));
    fireEvent.click(screen.getByText('mui.dataGrid.showCellBorders'));

    expect(onChangeSettings).toHaveBeenCalledTimes(2);

    const toggleColumn = onChangeSettings.mock.calls[0][0];
    const state1 = toggleColumn({
      density: 'standard',
      showCellVerticalBorder: false,
      showColumnVerticalBorder: true,
    });
    expect(state1.showColumnVerticalBorder).toBe(false);

    const toggleCell = onChangeSettings.mock.calls[1][0];
    const state2 = toggleCell({
      density: 'standard',
      showCellVerticalBorder: false,
      showColumnVerticalBorder: false,
    });
    expect(state2.showCellVerticalBorder).toBe(true);
  });
});
