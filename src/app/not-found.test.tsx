import { render } from '@testing-library/react';

import Page from './not-found';

jest.mock('src/sections/error', () => ({
  NotFoundView: () => <div data-testid="not-found-view" />,
}));

jest.mock('src/global-config', () => ({
  CONFIG: { appName: 'Test App' },
}));

describe('NotFoundPage', () => {
  it('renders NotFoundView', () => {
    const { getByTestId } = render(<Page />);
    expect(getByTestId('not-found-view')).toBeInTheDocument();
  });
});
