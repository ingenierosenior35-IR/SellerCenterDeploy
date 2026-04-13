import { AppError } from './app-error';
import { ErrorCode } from './error-codes';

describe('AppError', () => {
  it('creates an instance of Error', () => {
    const error = new AppError(ErrorCode.INVALID_CREDENTIALS);
    expect(error).toBeInstanceOf(Error);
  });

  it('creates an instance of AppError', () => {
    const error = new AppError(ErrorCode.INVALID_CREDENTIALS);
    expect(error).toBeInstanceOf(AppError);
  });

  it('stores the error code', () => {
    const error = new AppError(ErrorCode.NETWORK_ERROR);
    expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
  });

  it('stores optional status', () => {
    const error = new AppError(ErrorCode.UNEXPECTED_ERROR, 500);
    expect(error.status).toBe(500);
  });

  it('has undefined status when not provided', () => {
    const error = new AppError(ErrorCode.INVALID_CREDENTIALS);
    expect(error.status).toBeUndefined();
  });

  it('sets the message to the error code', () => {
    const error = new AppError(ErrorCode.INVALID_CREDENTIALS);
    expect(error.message).toBe(ErrorCode.INVALID_CREDENTIALS);
  });

  it('handles all error codes', () => {
    Object.values(ErrorCode).forEach((code) => {
      const error = new AppError(code as ErrorCode);
      expect(error.code).toBe(code);
    });
  });
});
