import React from 'react';
import { render, screen } from '@testing-library/react';

const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

jest.mock('@iconify/react', () => ({
  Icon: ({ icon, id, className }: any) => (
    <span data-testid="iconify-root" data-icon={icon} id={id} className={className} />
  ),
}));

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

const registerIcons = jest.fn();

jest.mock('./register-icons', () => ({
  allIconNames: ['solar:home-angle-bold-duotone'],
  registerIcons: () => registerIcons(),
}));

describe('Iconify', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders icon and registers icons', async () => {
    const { Iconify } = await import('./iconify');
    render(<Iconify icon={'solar:home-angle-bold-duotone' as any} />);
    expect(screen.getByTestId('iconify-root')).toBeInTheDocument();
    expect(registerIcons).toHaveBeenCalled();
  });

  it('warns when icon is not preloaded', async () => {
    const { Iconify } = await import('./iconify');
    render(<Iconify icon={'unknown:icon' as any} />);
    expect(warnSpy).toHaveBeenCalled();
  });
});
