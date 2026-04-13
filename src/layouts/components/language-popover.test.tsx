import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { LanguagePopover } from './language-popover';

const onChangeLang = jest.fn();
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

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    currentLang: 'en',
    onChangeLang,
    currentLangOption: { icon: 'US' },
    allLanguages: [
      { value: 'en', label: 'English', icon: 'US' },
      { value: 'es', label: 'Español', icon: 'ES' },
    ],
  }),
}));

jest.mock('src/components/flag-icon', () => ({
  FlagIcon: ({ code }: any) => <span data-testid={`flag-${code}`} />,
}));

jest.mock('src/components/custom-popover', () => ({
  CustomPopover: ({ children }: any) => <div data-testid="popover">{children}</div>,
}));

jest.mock('src/components/animate', () => ({
  varTap: () => ({}),
  varHover: () => ({}),
  transitionTap: () => ({}),
}));

const theme = createTheme({ cssVariables: true } as any);
(theme as any).vars = {
  ...(theme as any).vars,
  palette: {
    ...(theme as any).vars?.palette,
    action: {
      ...((theme as any).vars?.palette?.action ?? {}),
      selected: '#eee',
    },
  },
};

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('LanguagePopover', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders current language flag and menu', () => {
    renderWithTheme(<LanguagePopover />);
    expect(screen.getAllByTestId('flag-US').length).toBeGreaterThan(0);
    expect(screen.getByTestId('popover')).toBeInTheDocument();
  });

  it('changes language and closes popover', () => {
    renderWithTheme(<LanguagePopover />);
    fireEvent.click(screen.getByText('Español'));
    expect(onChangeLang).toHaveBeenCalledWith('es');
    expect(onClose).toHaveBeenCalled();
  });

  it('opens popover on icon button click', () => {
    renderWithTheme(<LanguagePopover />);
    fireEvent.click(screen.getByRole('button', { name: /Languages button/i }));
    expect(onOpen).toHaveBeenCalled();
  });
});
