import { VALIDATE_MASS_UPLOAD_QUERY } from './validate-mass-upload';

describe('validate-mass-upload graphql mutation', () => {
  it('is a non-empty string', () => {
    expect(typeof VALIDATE_MASS_UPLOAD_QUERY).toBe('string');
    expect(VALIDATE_MASS_UPLOAD_QUERY.length).toBeGreaterThan(0);
  });

  it('contains ValidateMassUpload mutation name', () => {
    expect(VALIDATE_MASS_UPLOAD_QUERY).toContain('ValidateMassUpload');
  });

  it('contains validateMassUpload field', () => {
    expect(VALIDATE_MASS_UPLOAD_QUERY).toContain('validateMassUpload');
  });
});
