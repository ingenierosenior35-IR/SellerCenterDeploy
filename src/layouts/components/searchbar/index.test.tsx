import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Searchbar } from './index';

const onFalse = jest.fn();
const onTrue = jest.fn();
const onToggle = jest.fn();

const flattenNavSections = jest.fn((data: unknown[]) => data);
const applyFilter = jest.fn(({ inputData, query }: { inputData: any[]; query: string }) => {
  if (!query) return inputData;
  return inputData.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.path.toLowerCase().includes(query.toLowerCase())
  );
});

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: () => ({
    value: true,
    onFalse: () => {
      onFalse();
    },
    onTrue: () => {
      onTrue();
    },
    onToggle: () => {
      onToggle();
    },
  }),
}));

jest.mock('autosuggest-highlight/match', () => jest.fn(() => []));
jest.mock('autosuggest-highlight/parse', () => jest.fn((text: string) => [{ text, highlight: false }]));

jest.mock('@mui/material/useMediaQuery', () => jest.fn(() => true));

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
  }),
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/icons', () => ({
  SearchIcon: () => <span data-testid="search-icon" />,
}));

jest.mock('src/components/scrollbar', () => ({
  Scrollbar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('src/components/search-not-found', () => ({
  SearchNotFound: ({ query }: { query: string }) => <div>No results for {query}</div>,
}));

jest.mock('./result-item', () => ({
  ResultItem: ({ href, labels, onClick }: any) => (
    <button type="button" onClick={onClick}>
      {href}-{labels.join('.')}
    </button>
  ),
}));

jest.mock('./utils', () => ({
  flattenNavSections: (...args: any[]) => flattenNavSections(...args),
  applyFilter: (...args: any[]) => applyFilter(...args),
}));

describe('Searchbar', () => {
  const data = [{ title: 'Products', path: '/products', group: 'Dashboard.Catalog' }];
  const theme = createTheme({ cssVariables: true } as any);

  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens dialog from trigger and renders base translated text', () => {
    renderWithTheme(<Searchbar data={data} />);

    expect(screen.getByText('search')).toBeInTheDocument();
    fireEvent.click(screen.getByText('search'));

    expect(onTrue).toHaveBeenCalled();
    expect(screen.getByPlaceholderText('search')).toBeInTheDocument();
  });

  it('filters results by query and closes result click', () => {
    renderWithTheme(<Searchbar data={data} />);

    fireEvent.change(screen.getByPlaceholderText('search'), { target: { value: 'prod' } });

    expect(applyFilter).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /\/products-Dashboard.Catalog/i }));

    expect(onFalse).toHaveBeenCalled();
  });

  it('shows not found state and handles meta+k shortcut', () => {
    renderWithTheme(<Searchbar data={data} />);

    fireEvent.change(screen.getByPlaceholderText('search'), { target: { value: 'missing' } });
    expect(screen.getByText('No results for missing')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(onToggle).toHaveBeenCalled();
  });
});
