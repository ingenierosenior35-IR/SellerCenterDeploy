import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';

import { ThemeToggleButton } from './theme-toggle-button';

const setMode = jest.fn();

jest.mock('@mui/material/styles', () => {
  const actual = jest.requireActual('@mui/material/styles');
  return {
    ...actual,
    useColorScheme: () => ({
      mode: 'dark',
      setMode,
    }),
  };
});

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/icons', () => ({
  MoonIcon: ({ sx }: any) => <span data-testid="moon-icon" data-sx={JSON.stringify(sx)} />,
}));

describe('ThemeToggleButton', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders button', () => {
    render(<ThemeToggleButton />);
    expect(screen.getByRole('button', { name: /Cambiar tema/i })).toBeInTheDocument();
  });

  it('toggles mode on click and re-enables after timeout', () => {
    render(<ThemeToggleButton />);
    const btn = screen.getByRole('button', { name: /Cambiar tema/i });

    fireEvent.click(btn);
    expect(setMode).toHaveBeenCalledWith('light');

    act(() => {
      jest.advanceTimersByTime(500);
    });
  });
});
