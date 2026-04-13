import { AppError } from 'src/lib/errors/app-error';
import { ErrorCode } from 'src/lib/errors/error-codes';

import { getErrorMessage } from './error-message';

describe('getErrorMessage', () => {
  it('returns message for AppError with known code', () => {
    const error = new AppError(ErrorCode.INVALID_CREDENTIALS);
    const msg = getErrorMessage(error);
    expect(msg).toContain('iniciar sesión');
  });

  it('returns message for AppError NETWORK_ERROR', () => {
    const error = new AppError(ErrorCode.NETWORK_ERROR);
    const msg = getErrorMessage(error);
    expect(msg).toContain('servidor');
  });

  it('returns message for AppError UNEXPECTED_ERROR', () => {
    const error = new AppError(ErrorCode.UNEXPECTED_ERROR);
    const msg = getErrorMessage(error);
    expect(msg).toContain('problema');
  });

  it('returns error.message for native Error', () => {
    const error = new Error('Something went wrong');
    expect(getErrorMessage(error)).toBe('Something went wrong');
  });

  it('returns error.name when message is empty for native Error', () => {
    const error = new Error();
    error.message = '';
    expect(getErrorMessage(error)).toBe('Error');
  });

  it('returns string directly', () => {
    expect(getErrorMessage('custom error')).toBe('custom error');
  });

  it('returns message from object with message property', () => {
    expect(getErrorMessage({ message: 'object error' })).toBe('object error');
  });

  it('returns unknown error string for other types', () => {
    expect(getErrorMessage(42)).toContain('Unknown error');
  });

  it('returns unknown error string for null-like object without message', () => {
    expect(getErrorMessage({ code: 404 })).toContain('Unknown error');
  });
});
