import { getSession, setSession, validateSession } from './utils';

const FAKE_UID = 'user-42';
const FAKE_EXP_VALID = Math.floor(Date.now() / 1000) + 3600; // 1h in the future
const FAKE_EXP_EXPIRED = Math.floor(Date.now() / 1000) - 3600; // 1h in the past

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({ uid: FAKE_UID, exp: FAKE_EXP_VALID })),
}));

import { jwtDecode } from 'jwt-decode';

const jwtDecodeMock = jwtDecode as jest.Mock;

describe('auth/context/utils', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    jwtDecodeMock.mockReturnValue({ uid: FAKE_UID, exp: FAKE_EXP_VALID });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getSession', () => {
    it('returns null when no token in localStorage', () => {
      expect(getSession()).toBeNull();
    });

    it('returns the stored token', () => {
      localStorage.setItem('access_token', 'my-token');
      expect(getSession()).toBe('my-token');
    });

    it('throws when localStorage.getItem fails', () => {
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('boom');
      });

      expect(() => getSession()).toThrow('boom');
      getItemSpy.mockRestore();
    });
  });

  describe('setSession', () => {
    it('stores token, customer_id and expiration_time for valid token', () => {
      setSession('abc-123');

      expect(jwtDecodeMock).toHaveBeenCalledWith('abc-123');
      expect(localStorage.getItem('access_token')).toBe('abc-123');
      expect(localStorage.getItem('customer_id')).toBe(FAKE_UID);
      expect(localStorage.getItem('expiration_time')).toBe(FAKE_EXP_VALID.toString());
    });

    it('does not store expiration_time when token is expired', () => {
      jwtDecodeMock.mockReturnValue({ uid: FAKE_UID, exp: FAKE_EXP_EXPIRED });

      setSession('expired-token');

      expect(localStorage.getItem('access_token')).toBe('expired-token');
      expect(localStorage.getItem('customer_id')).toBe(FAKE_UID);
      expect(localStorage.getItem('expiration_time')).toBeNull();
    });

    it('removes all keys when null passed', () => {
      localStorage.setItem('access_token', 'abc');
      localStorage.setItem('expiration_time', '123');
      localStorage.setItem('customer_id', 'uid');

      setSession(null);

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('expiration_time')).toBeNull();
      expect(localStorage.getItem('customer_id')).toBeNull();
    });
  });

  describe('validateSession', () => {
    it('returns false and clears session when no token exists', () => {
      const result = validateSession();

      expect(result).toBe(false);
      expect(localStorage.getItem('access_token')).toBeNull();
    });

    it('returns false when token exists but no expiration_time', () => {
      localStorage.setItem('access_token', 'some-token');

      const result = validateSession();

      expect(result).toBe(false);
    });

    it('returns true when valid non-expired token exists', () => {
      localStorage.setItem('access_token', 'valid-token');
      localStorage.setItem('expiration_time', FAKE_EXP_VALID.toString());

      const result = validateSession();

      expect(result).toBe(true);
      expect(localStorage.getItem('access_token')).toBe('valid-token');
    });

    it('returns false and clears session for expired token', () => {
      localStorage.setItem('access_token', 'old-token');
      localStorage.setItem('expiration_time', FAKE_EXP_EXPIRED.toString());

      const result = validateSession();

      expect(result).toBe(false);
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('expiration_time')).toBeNull();
    });
  });
});
