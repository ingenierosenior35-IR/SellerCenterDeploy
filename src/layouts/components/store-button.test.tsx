import { render, screen } from '@testing-library/react';

import { StoreButton } from './store-button';

jest.mock('src/components/icons', () => ({
  StoreIcon: () => <span data-testid="store-icon" />,
}));

describe('StoreButton', () => {
  it('renders store icon', () => {
    render(<StoreButton />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('store-icon')).toBeInTheDocument();
  });
});
