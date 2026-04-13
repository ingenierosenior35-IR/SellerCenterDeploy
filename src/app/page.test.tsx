import { render } from '@testing-library/react';

import Page from './page';

const mockPush = jest.fn();

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), refresh: jest.fn() }),
}));

jest.mock('src/global-config', () => ({
  CONFIG: { auth: { redirectPath: '/home' } },
}));

describe('RootPage', () => {
  it('calls router.push with redirectPath on mount', () => {
    render(<Page />);
    expect(mockPush).toHaveBeenCalledWith('/home');
  });
});
