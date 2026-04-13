import { EXPIRATION_TIME, ACCESS_TOKEN_STORAGE_KEY } from './constant';

describe('auth constants', () => {
  it('ACCESS_TOKEN_STORAGE_KEY is a non-empty string', () => {
    expect(typeof ACCESS_TOKEN_STORAGE_KEY).toBe('string');
    expect(ACCESS_TOKEN_STORAGE_KEY.length).toBeGreaterThan(0);
  });

  it('EXPIRATION_TIME is a non-empty string', () => {
    expect(typeof EXPIRATION_TIME).toBe('string');
    expect(EXPIRATION_TIME.length).toBeGreaterThan(0);
  });

  it('constants have distinct values', () => {
    expect(ACCESS_TOKEN_STORAGE_KEY).not.toBe(EXPIRATION_TIME);
  });
});
