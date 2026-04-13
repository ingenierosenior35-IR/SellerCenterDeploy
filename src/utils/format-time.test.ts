import {
  fAdd,
  fSub,
  today,
  fDate,
  fTime,
  fToNow,
  fIsSame,
  fDateTime,
  fTimestamp,
  fDateRangeShortLabel,
} from './format-time';

describe('format-time utils', () => {
  const FIXED_DATE = '2024-04-17T12:00:00';

  describe('today', () => {
    it('returns a string', () => {
      expect(typeof today()).toBe('string');
    });
    it('returns formatted with template', () => {
      const result = today('YYYY');
      expect(result).toMatch(/^\d{4}$/);
    });
  });

  describe('fDate', () => {
    it('formats a valid date', () => {
      expect(fDate(FIXED_DATE)).toMatch(/\d{2} \w+ \d{4}/);
    });
    it('returns empty string for null', () => {
      expect(fDate(null)).toBe('');
    });
    it('returns empty string for undefined', () => {
      expect(fDate(undefined)).toBe('');
    });
    it('returns "Invalid" for bad input', () => {
      expect(fDate('not-a-date')).toBe('Invalid');
    });
    it('uses custom template', () => {
      const result = fDate(FIXED_DATE, 'YYYY');
      expect(result).toBe('2024');
    });
  });

  describe('fTime', () => {
    it('formats a valid time', () => {
      expect(fTime(FIXED_DATE)).toMatch(/\d{1,2}:\d{2} (am|pm)/);
    });
    it('returns empty string for null', () => {
      expect(fTime(null)).toBe('');
    });
    it('returns "Invalid" for bad input', () => {
      expect(fTime('bad')).toBe('Invalid');
    });
  });

  describe('fDateTime', () => {
    it('formats a valid datetime', () => {
      expect(fDateTime(FIXED_DATE)).toMatch(/\d{2} \w+ \d{4}/);
    });
    it('returns empty string for null', () => {
      expect(fDateTime(null)).toBe('');
    });
    it('returns "Invalid" for bad input', () => {
      expect(fDateTime('bad-date')).toBe('Invalid');
    });
  });

  describe('fTimestamp', () => {
    it('returns a number for valid input', () => {
      expect(typeof fTimestamp(FIXED_DATE)).toBe('number');
    });
    it('returns empty string for null', () => {
      expect(fTimestamp(null)).toBe('');
    });
    it('returns "Invalid" for bad input', () => {
      expect(fTimestamp('bad')).toBe('Invalid');
    });
  });

  describe('fToNow', () => {
    it('returns a relative string for valid input', () => {
      expect(typeof fToNow(FIXED_DATE)).toBe('string');
    });
    it('returns empty string for null', () => {
      expect(fToNow(null)).toBe('');
    });
    it('returns "Invalid" for bad input', () => {
      expect(fToNow('bad')).toBe('Invalid');
    });
  });

  describe('fIsSame', () => {
    it('returns true for same year', () => {
      expect(fIsSame('2024-01-01', '2024-12-31', 'year')).toBe(true);
    });
    it('returns false for different year', () => {
      expect(fIsSame('2023-01-01', '2024-01-01', 'year')).toBe(false);
    });
    it('returns false for null input', () => {
      expect(fIsSame(null, '2024-01-01')).toBe(false);
    });
    it('returns false for invalid date', () => {
      expect(fIsSame('bad', '2024-01-01')).toBe(false);
    });
    it('defaults to year unit', () => {
      expect(fIsSame('2024-01-01', '2024-06-01')).toBe(true);
    });
  });

  describe('fDateRangeShortLabel', () => {
    it('returns empty string for missing inputs', () => {
      expect(fDateRangeShortLabel(null, null)).toBe('');
    });
    it('returns "Invalid" for bad dates', () => {
      expect(fDateRangeShortLabel('bad', '2024-01-01')).toBe('Invalid');
    });
    it('returns "Invalid" if start is after end', () => {
      expect(fDateRangeShortLabel('2024-12-31', '2024-01-01')).toBe('Invalid');
    });
    it('returns single date for same day', () => {
      const result = fDateRangeShortLabel('2024-04-17', '2024-04-17');
      expect(result).toContain('Apr 2024');
    });
    it('returns range for same month', () => {
      const result = fDateRangeShortLabel('2024-04-01', '2024-04-30');
      expect(result).toContain('Apr 2024');
    });
    it('returns range for same year different months', () => {
      const result = fDateRangeShortLabel('2024-04-01', '2024-05-31');
      expect(result).toContain('Apr');
      expect(result).toContain('May');
    });
    it('returns full range for different years', () => {
      const result = fDateRangeShortLabel('2023-12-25', '2024-01-01');
      expect(result).toContain('2023');
      expect(result).toContain('2024');
    });
    it('uses initial format when initial=true', () => {
      const result = fDateRangeShortLabel('2024-04-01', '2024-04-30', true);
      expect(result).toContain(' - ');
    });
  });

  describe('fAdd', () => {
    it('returns a string', () => {
      expect(typeof fAdd({ days: 1 })).toBe('string');
    });
    it('handles empty params', () => {
      expect(typeof fAdd({})).toBe('string');
    });
  });

  describe('fSub', () => {
    it('returns a string', () => {
      expect(typeof fSub({ months: 1 })).toBe('string');
    });
    it('handles empty params', () => {
      expect(typeof fSub({})).toBe('string');
    });
  });
});
