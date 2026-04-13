import { validateCsvFile } from './validate-csv';

describe('validateCsvFile', () => {
  const createFile = (size: number, type = 'text/csv', name = 'test.csv') => {
    const content = 'a'.repeat(size);
    return new File([content], name, { type });
  };

  it('resolves with empty array for file within size limit', async () => {
    const file = createFile(100);
    const errors = await validateCsvFile(file);
    expect(errors).toEqual([]);
  });

  it('resolves with error when file exceeds size limit', async () => {
    const file = createFile(800000);
    const errors = await validateCsvFile(file);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('demasiado grande');
  });

  it('resolves with error exactly at limit boundary (over)', async () => {
    const file = createFile(784874);
    const errors = await validateCsvFile(file);
    expect(errors).toHaveLength(1);
  });

  it('resolves with empty array for file exactly at limit boundary (at limit)', async () => {
    const file = createFile(784873);
    const errors = await validateCsvFile(file);
    expect(errors).toEqual([]);
  });
});
