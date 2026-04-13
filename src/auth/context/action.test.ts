jest.mock('src/lib/axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
  endpoints: {
    auth: {
      signUp: '/auth/sign-up',
    },
  },
}));

import axios from 'src/lib/axios';

import { signUp } from './action';
import { ACCESS_TOKEN_STORAGE_KEY } from './constant';

describe('auth/context/action signUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('stores access token on success', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { accessToken: 'token-123' } });

    await signUp({
      email: 'a@b.com',
      password: '123456',
      firstName: 'Juan',
      lastName: 'Ramirez',
    });

    expect(axios.post).toHaveBeenCalledWith('/auth/sign-up', {
      email: 'a@b.com',
      password: '123456',
      firstName: 'Juan',
      lastName: 'Ramirez',
    });
    expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('token-123');
  });

  it('throws when response has no accessToken', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });

    await expect(
      signUp({
        email: 'a@b.com',
        password: '123456',
        firstName: 'Juan',
        lastName: 'Ramirez',
      })
    ).rejects.toThrow('Access token not found in response');
  });

  it('rethrows axios error', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('network'));

    await expect(
      signUp({
        email: 'a@b.com',
        password: '123456',
        firstName: 'Juan',
        lastName: 'Ramirez',
      })
    ).rejects.toThrow('network');
  });
});
