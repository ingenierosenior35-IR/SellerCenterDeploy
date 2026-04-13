import { render, screen } from '@testing-library/react';

import Page from './page';

jest.mock('src/global-config', () => ({
  CONFIG: { appName: 'Test App' },
}));

jest.mock('src/sections/return/view', () => ({
  ReturnListView: () => <div data-testid="return-list-view" />,
}));

describe('ReturnPage', () => {
  it('renders ReturnListView', () => {
    render(<Page />);
    expect(screen.getByTestId('return-list-view')).toBeInTheDocument();
  });
});
