import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import {
  ToolbarContainer,
  ToolbarLeftPanel,
  ToolbarButtonBase,
  ToolbarRightPanel,
  CustomToolbarQuickFilter,
  CustomToolbarFilterButton,
  CustomToolbarExportButton,
  CustomToolbarColumnsButton,
} from './toolbar-core';

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
    translate: (k: string) => k,
  }),
}));

jest.mock('../iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/theme/core/components/mui-x-data-grid', () => ({
  ExportIcon: () => <span data-testid="export-icon" />,
  FilterIcon: () => <span data-testid="filter-icon" />,
  ViewColumnsIcon: () => <span data-testid="columns-icon" />,
}));

jest.mock('@mui/x-data-grid', () => ({
  useGridApiContext: () => ({
    current: {
      getLocaleText: (key: string) => key,
    },
  }),
  ColumnsPanelTrigger: ({ render: renderFn }: any) => renderFn({ 'data-testid': 'columns-trigger' }),
  FilterPanelTrigger: ({ render: renderFn }: any) => renderFn({ 'data-testid': 'filter-trigger' }, { filterCount: 2 }),
  ExportPrint: ({ children, onClick }: any) => <div onClick={onClick}>{children}</div>,
  ExportCsv: ({ children, onClick }: any) => <div onClick={onClick}>{children}</div>,
  QuickFilter: ({ render: renderFn }: any) => renderFn({ 'data-testid': 'quick-filter-root' }),
  QuickFilterControl: ({ render: renderFn }: any) =>
    renderFn(
      {
        slotProps: {},
        value: '',
        onChange: jest.fn(),
      },
      { value: 'abc' }
    ),
  QuickFilterClear: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

describe('ToolbarButtonBase', () => {
  it('renders button with label when showLabel=true', () => {
    render(<ToolbarButtonBase label="MyLabel" icon={<span>icon</span>} showLabel />);
    expect(screen.getByText('MyLabel')).toBeInTheDocument();
  });

  it('renders icon button when showLabel=false', () => {
    render(<ToolbarButtonBase label="MyLabel" icon={<span data-testid="icon-only" />} showLabel={false} />);
    expect(screen.getByTestId('icon-only')).toBeInTheDocument();
  });
});

describe('toolbar trigger buttons', () => {
  it('renders columns button', () => {
    render(<CustomToolbarColumnsButton showLabel />);
    expect(screen.getByText('toolbarColumns')).toBeInTheDocument();
  });

  it('renders filter button', () => {
    render(<CustomToolbarFilterButton showLabel />);
    expect(screen.getByText('toolbarFilters')).toBeInTheDocument();
  });

  it('renders export menu and handles open/close', () => {
    render(<CustomToolbarExportButton showLabel />);
    fireEvent.click(screen.getByText('toolbarExport'));
    expect(onOpen).toHaveBeenCalled();

    fireEvent.click(screen.getByText('toolbarExportPrint'));
    fireEvent.click(screen.getByText('toolbarExportCSV'));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('CustomToolbarQuickFilter', () => {
  it('renders quick filter input with translated clear label', () => {
    render(<CustomToolbarQuickFilter />);
    expect(screen.getByLabelText('toolbarQuickFilterLabel')).toBeInTheDocument();
    expect(screen.getByLabelText('mui.dataGrid.toolbarQuickFilterDeleteIconLabel')).toBeInTheDocument();
  });
});

describe('styled toolbar panels', () => {
  it('renders container and panels', () => {
    render(
      <div>
        <ToolbarContainer data-testid="container" />
        <ToolbarLeftPanel data-testid="left" />
        <ToolbarRightPanel data-testid="right" />
      </div>
    );

    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });
});
