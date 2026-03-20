'use client';

import type { DataGridProps } from '@mui/x-data-grid';
import type { ToolbarButtonBaseProps } from './toolbar-core';

import { usePopover } from 'minimal-shared/hooks';
import { useMemo, useState, useCallback } from 'react';

import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { svgIconClasses } from '@mui/material/SvgIcon';

import { useTranslate } from 'src/locales/langs/i18n';
import {
  EyeIcon,
  EyeCloseIcon,
  DensityCompactIcon,
  DensityStandardIcon,
  DensityComfortableIcon,
} from 'src/theme/core/components/mui-x-data-grid';

import { Iconify } from '../iconify';
import { ToolbarButtonBase } from './toolbar-core';

// ----------------------------------------------------------------------

/**
 * Docs
 * https://mui.com/x/react-data-grid/components/toolbar/
 */

export type GridSettingsState = Pick<
  DataGridProps,
  'density' | 'showCellVerticalBorder' | 'showColumnVerticalBorder'
>;

type GridSettingsOutput = GridSettingsState & Pick<DataGridProps, 'localeText'>;

export type CustomToolbarSettingsButtonProps = {
  settings: GridSettingsOutput;
  onChangeSettings: React.Dispatch<React.SetStateAction<GridSettingsState>>;
};

export function useToolbarSettings(
  initialSettings?: Partial<GridSettingsState>
): CustomToolbarSettingsButtonProps {
  const { translate } = useTranslate();

  const defaultSettings: GridSettingsState = {
    density: 'standard',
    showCellVerticalBorder: false,
    showColumnVerticalBorder: false,
    ...initialSettings,
  };

  const [settings, setSettings] = useState<GridSettingsState>(defaultSettings);

  const localeText = useMemo<NonNullable<DataGridProps['localeText']>>(
    () => ({
      noRowsLabel: translate('mui.dataGrid.noRowsLabel'),
      noResultsOverlayLabel: translate('mui.dataGrid.noResultsOverlayLabel'),
      toolbarColumns: translate('mui.dataGrid.toolbarColumns'),
      toolbarFilters: translate('mui.dataGrid.toolbarFilters'),
      toolbarExport: translate('mui.dataGrid.toolbarExport'),
      toolbarExportCSV: translate('mui.dataGrid.toolbarExportCSV'),
      toolbarExportPrint: translate('mui.dataGrid.toolbarExportPrint'),
      toolbarQuickFilterLabel: translate('mui.dataGrid.toolbarQuickFilterLabel'),
      toolbarQuickFilterPlaceholder: translate('mui.dataGrid.toolbarQuickFilterPlaceholder'),
      toolbarQuickFilterDeleteIconLabel: translate('mui.dataGrid.toolbarQuickFilterDeleteIconLabel'),
    }),
    [translate]
  );

  return {
    settings: {
      ...settings,
      localeText,
    },
    onChangeSettings: setSettings,
  };
}

// ----------------------------------------------------------------------

type GridDensityOption = {
  labelKey: string;
  value: GridSettingsState['density'];
  icon: React.ReactNode;
};

const GRID_DENSITY_OPTIONS: GridDensityOption[] = [
  { labelKey: 'mui.dataGrid.densityCompact', value: 'compact', icon: <DensityCompactIcon /> },
  { labelKey: 'mui.dataGrid.densityStandard', value: 'standard', icon: <DensityStandardIcon /> },
  {
    labelKey: 'mui.dataGrid.densityComfortable',
    value: 'comfortable',
    icon: <DensityComfortableIcon />,
  },
];

export function CustomToolbarSettingsButton({
  settings,
  onChangeSettings,
  showLabel,
  label,
}: Pick<ToolbarButtonBaseProps, 'label' | 'showLabel'> & CustomToolbarSettingsButtonProps) {
  const { translate } = useTranslate();

  const settingsLabel = label ?? translate('mui.dataGrid.toolbarSettings');

  const { open, anchorEl, onClose, onOpen } = usePopover();

  const handleChangeDensity = useCallback(
    (value: GridSettingsState['density']) => {
      onChangeSettings((prev) => ({ ...prev, density: value }));
    },
    [onChangeSettings]
  );

  const handleToggleSetting = useCallback(
    (key: 'showCellVerticalBorder' | 'showColumnVerticalBorder') => {
      onChangeSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [onChangeSettings]
  );

  const renderToggleOption = (
    menuItemLabel: string,
    key: 'showColumnVerticalBorder' | 'showCellVerticalBorder'
  ) => {
    const selected = settings[key];

    return (
      <MenuItem key={key} selected={selected} onClick={() => handleToggleSetting(key)}>
        {selected ? <EyeIcon /> : <EyeCloseIcon />}
        {menuItemLabel}
      </MenuItem>
    );
  };

  return (
    <>
      <Tooltip title={settingsLabel}>
        <ToolbarButtonBase
          id="settings-menu-trigger"
          aria-controls="settings-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={onOpen}
          label={settingsLabel}
          icon={<Iconify icon="solar:settings-bold" />}
          showLabel={showLabel}
        />
      </Tooltip>

      <Menu
        id="settings-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          list: {
            'aria-labelledby': 'settings-menu-trigger',
            sx: {
              [`& .${svgIconClasses.root}`]: {
                mr: 2,
                fontSize: 20,
              },
            },
          },
        }}
      >
        {GRID_DENSITY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={settings.density === option.value}
            onClick={() => handleChangeDensity(option.value)}
          >
            {option.icon}
            {translate(option.labelKey)}
          </MenuItem>
        ))}

        <Divider />

        {renderToggleOption(translate('mui.dataGrid.showColumnBorders'), 'showColumnVerticalBorder')}
        {renderToggleOption(translate('mui.dataGrid.showCellBorders'), 'showCellVerticalBorder')}
      </Menu>
    </>
  );
}
