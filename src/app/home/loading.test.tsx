import { render } from '@testing-library/react';

import HomeLoading from './loading';

jest.mock('src/components/loading-screen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

describe('HomeLoading', () => {
  it('renders LoadingScreen', () => {
    const { getByTestId } = render(<HomeLoading />);
    expect(getByTestId('loading-screen')).toBeInTheDocument();
  });
});
