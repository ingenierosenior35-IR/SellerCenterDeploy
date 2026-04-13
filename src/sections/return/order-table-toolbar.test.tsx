import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { OrderTableToolbar } from './order-table-toolbar';

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/custom-popover', () => ({
  CustomPopover: ({ open, children }: any) =>
    open ? <div data-testid="custom-popover">{children}</div> : null,
}));

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (_ns: string) => _ns,
    currentLang: 'es',
  }),
}));

jest.mock('minimal-shared/hooks', () => ({
  usePopover: () => ({
    open: false,
    anchorEl: null,
    onOpen: jest.fn(),
    onClose: jest.fn(),
  }),
}));

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const makeFilters = (name = '') => ({
  state: { name },
  setState: jest.fn(),
  resetState: jest.fn(),
  onResetState: jest.fn(),
});

describe('OrderTableToolbar', () => {
  it('renders the search text field', () => {
    renderWithTheme(
      <OrderTableToolbar
        filters={makeFilters() as any}
        onResetPage={jest.fn()}
      />
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders search icon', () => {
    renderWithTheme(
      <OrderTableToolbar
        filters={makeFilters() as any}
        onResetPage={jest.fn()}
      />
    );
    expect(screen.getByTestId('icon-eva:search-fill')).toBeInTheDocument();
  });

  it('renders more options icon button', () => {
    renderWithTheme(
      <OrderTableToolbar
        filters={makeFilters() as any}
        onResetPage={jest.fn()}
      />
    );
    expect(screen.getByTestId('icon-eva:more-vertical-fill')).toBeInTheDocument();
  });

  it('calls setState when typing in search field', () => {
    const filters = makeFilters();
    renderWithTheme(
      <OrderTableToolbar filters={filters as any} onResetPage={jest.fn()} />
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
    expect(filters.setState).toHaveBeenCalledWith({ name: 'test' });
  });

  it('calls onResetPage when typing in search field', () => {
    const onResetPage = jest.fn();
    renderWithTheme(
      <OrderTableToolbar filters={makeFilters() as any} onResetPage={onResetPage} />
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'query' } });
    expect(onResetPage).toHaveBeenCalled();
  });

  it('shows current filter name in input', () => {
    renderWithTheme(
      <OrderTableToolbar
        filters={makeFilters('existing-filter') as any}
        onResetPage={jest.fn()}
      />
    );
    expect(screen.getByDisplayValue('existing-filter')).toBeInTheDocument();
  });
});
