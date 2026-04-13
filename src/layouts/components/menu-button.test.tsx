import { render, screen, fireEvent } from '@testing-library/react';

import { MenuButton } from './menu-button';

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon, width }: { icon: string; width: number }) => (
    <span data-testid="iconify" data-icon={icon} data-width={width} />
  ),
}));

describe('MenuButton', () => {
  it('renders menu icon with expected props', () => {
    render(<MenuButton />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('iconify')).toHaveAttribute('data-icon', 'custom:menu-duotone');
    expect(screen.getByTestId('iconify')).toHaveAttribute('data-width', '24');
  });

  it('forwards click handler', () => {
    const onClick = jest.fn();

    render(<MenuButton onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
