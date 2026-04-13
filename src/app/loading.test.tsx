import { render } from '@testing-library/react';

import Loading from './loading';

jest.mock('src/components/loading-screen', () => ({
  SplashScreen: () => <div data-testid="splash-screen" />,
}));

describe('Loading', () => {
  it('renders SplashScreen', () => {
    const { getByTestId } = render(<Loading />);
    expect(getByTestId('splash-screen')).toBeInTheDocument();
  });
});
