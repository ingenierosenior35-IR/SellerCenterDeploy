import { ErrorCode } from './error-codes';
import { ERROR_MESSAGES } from './error-messages';

describe('ErrorCode', () => {
  it('has INVALID_CREDENTIALS', () => {
    expect(ErrorCode.INVALID_CREDENTIALS).toBe('INVALID_CREDENTIALS');
  });

  it('has UNEXPECTED_ERROR', () => {
    expect(ErrorCode.UNEXPECTED_ERROR).toBe('UNEXPECTED_ERROR');
  });

  it('has NETWORK_ERROR', () => {
    expect(ErrorCode.NETWORK_ERROR).toBe('NETWORK_ERROR');
  });
});

describe('ERROR_MESSAGES', () => {
  it('has a message for INVALID_CREDENTIALS', () => {
    expect(typeof ERROR_MESSAGES[ErrorCode.INVALID_CREDENTIALS]).toBe('string');
    expect(ERROR_MESSAGES[ErrorCode.INVALID_CREDENTIALS].length).toBeGreaterThan(0);
  });

  it('has a message for UNEXPECTED_ERROR', () => {
    expect(typeof ERROR_MESSAGES[ErrorCode.UNEXPECTED_ERROR]).toBe('string');
    expect(ERROR_MESSAGES[ErrorCode.UNEXPECTED_ERROR].length).toBeGreaterThan(0);
  });

  it('has a message for NETWORK_ERROR', () => {
    expect(typeof ERROR_MESSAGES[ErrorCode.NETWORK_ERROR]).toBe('string');
    expect(ERROR_MESSAGES[ErrorCode.NETWORK_ERROR].length).toBeGreaterThan(0);
  });

  it('covers all error codes', () => {
    Object.values(ErrorCode).forEach((code) => {
      expect(ERROR_MESSAGES[code as ErrorCode]).toBeDefined();
    });
  });
});
