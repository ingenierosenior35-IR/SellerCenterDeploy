jest.mock('src/global-config', () => ({
  CONFIG: { assetsDir: '/assets', appName: 'Test', appVersion: '1.0.0' },
}));
jest.mock('src/routes/hooks', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));
jest.mock('src/routes/paths', () => ({
  paths: { settings: '/settings' },
}));
jest.mock('src/utils', () => ({
  getInitials: jest.fn(() => 'JD'),
}));
jest.mock('../svg-color', () => ({
  SvgColor: ({ src }: { src: string }) => <span data-src={src} />,
}));
jest.mock('src/components/animate', () => ({
  AnimateBorder: ({ children }: any) => <div>{children}</div>,
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import * as routesHooks from 'src/routes/hooks';

import { StoreIdentity } from './index';

const mockUser = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'john@example.com',
};

describe('StoreIdentity', () => {
  it('renders full name', () => {
    render(<StoreIdentity user={mockUser as any} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders email', () => {
    render(<StoreIdentity user={mockUser as any} />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders settings button', () => {
    render(<StoreIdentity user={mockUser as any} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onSettingsClick when settings button is clicked', () => {
    const onSettingsClick = jest.fn();
    render(<StoreIdentity user={mockUser as any} onSettingsClick={onSettingsClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSettingsClick).toHaveBeenCalledTimes(1);
  });

  it('navigates to settings when no onSettingsClick provided', () => {
    const push = jest.fn();
    (routesHooks.useRouter as jest.Mock).mockReturnValueOnce({ push });

    render(<StoreIdentity user={mockUser as any} />);
    fireEvent.click(screen.getByRole('button'));
    expect(push).toHaveBeenCalledWith('/settings');
  });
});
