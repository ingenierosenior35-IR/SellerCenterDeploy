import { fData, fNumber, fPercent, fCurrency, fShortenNumber } from './format-number';

describe('format-number utils', () => {
  describe('fNumber', () => {
    it('formats integer', () => {
      expect(fNumber(1234)).toBe('1,234');
    });
    it('formats float with decimals', () => {
      expect(fNumber(1234.56)).toBe('1,234.56');
    });
    it('returns empty string for null', () => {
      expect(fNumber(null)).toBe('');
    });
    it('returns empty string for undefined', () => {
      expect(fNumber(undefined)).toBe('');
    });
    it('handles string input', () => {
      expect(fNumber('9876')).toBe('9,876');
    });
    it('returns empty string for NaN string', () => {
      expect(fNumber(NaN)).toBe('');
    });
  });

  describe('fCurrency', () => {
    it('formats as USD currency', () => {
      expect(fCurrency(1000)).toContain('1,000');
    });
    it('returns empty string for null', () => {
      expect(fCurrency(null)).toBe('');
    });
    it('returns empty string for undefined', () => {
      expect(fCurrency(undefined)).toBe('');
    });
    it('includes currency symbol', () => {
      expect(fCurrency(50)).toContain('$');
    });
  });

  describe('fPercent', () => {
    it('formats 50 as ~50%', () => {
      expect(fPercent(50)).toContain('50');
    });
    it('returns empty string for null', () => {
      expect(fPercent(null)).toBe('');
    });
    it('returns empty string for undefined', () => {
      expect(fPercent(undefined)).toBe('');
    });
  });

  describe('fShortenNumber', () => {
    it('shortens large numbers', () => {
      expect(fShortenNumber(1000000)).toMatch(/1m|1M/i);
    });
    it('returns empty string for null', () => {
      expect(fShortenNumber(null)).toBe('');
    });
  });

  describe('fData', () => {
    it('returns 0 bytes for 0', () => {
      expect(fData(0)).toBe('0 bytes');
    });
    it('returns 0 bytes for null', () => {
      expect(fData(null)).toBe('0 bytes');
    });
    it('formats bytes', () => {
      expect(fData(500)).toContain('bytes');
    });
    it('formats kilobytes', () => {
      expect(fData(2048)).toContain('Kb');
    });
    it('formats megabytes', () => {
      expect(fData(2 * 1024 * 1024)).toContain('Mb');
    });
  });
});
