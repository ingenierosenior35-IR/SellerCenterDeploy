import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { SettingsButton } from './settings-button';

const onToggleDrawer = jest.fn();

jest.mock('src/components/settings', () => ({
  useSettingsContext: () => ({
    canReset: true,
    onToggleDrawer,
  }),
}));

jest.mock('src/components/animate', () => ({
  varTap: () => ({}),
  varHover: () => ({}),
  transitionTap: () => ({}),
}));

describe('SettingsButton', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders settings button', () => {
    render(<SettingsButton />);
    expect(screen.getByRole('button', { name: /Settings button/i })).toBeInTheDocument();
  });

  it('calls onToggleDrawer on click', () => {
    render(<SettingsButton />);
    fireEvent.click(screen.getByRole('button', { name: /Settings button/i }));
    expect(onToggleDrawer).toHaveBeenCalled();
  });
});
