import { countries } from './countries';

describe('countries', () => {
  it('has items', () => {
    expect(countries.length).toBeGreaterThan(0);
  });

  it('each item has code, label, phone fields', () => {
    countries.forEach((country) => {
      expect(country).toHaveProperty('code');
      expect(country).toHaveProperty('label');
      expect(country).toHaveProperty('phone');
    });
  });

  it('code is a non-empty string', () => {
    countries.forEach((country) => {
      expect(typeof country.code).toBe('string');
      expect(country.code.length).toBeGreaterThan(0);
    });
  });
});
