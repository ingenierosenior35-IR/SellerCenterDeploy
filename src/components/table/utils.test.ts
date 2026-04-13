import { rowInPage, emptyRows, getComparator } from './utils';

describe('rowInPage', () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it('returns correct slice for first page', () => {
    expect(rowInPage(data, 0, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('returns correct slice for second page', () => {
    expect(rowInPage(data, 1, 5)).toEqual([6, 7, 8, 9, 10]);
  });

  it('returns partial slice at end', () => {
    expect(rowInPage(data, 1, 7)).toEqual([8, 9, 10]);
  });

  it('returns empty array when page exceeds data length', () => {
    expect(rowInPage(data, 5, 5)).toEqual([]);
  });
});

describe('emptyRows', () => {
  it('returns 0 when page is 0', () => {
    expect(emptyRows(0, 5, 3)).toBe(0);
  });

  it('returns correct empty rows for page > 0', () => {
    expect(emptyRows(1, 10, 15)).toBe(5);
  });

  it('returns 0 when no empty rows needed', () => {
    expect(emptyRows(1, 5, 10)).toBe(0);
  });

  it('never returns negative', () => {
    expect(emptyRows(1, 5, 100)).toBe(0);
  });
});

describe('getComparator', () => {
  const data = [
    { name: 'banana', age: 30 },
    { name: 'apple', age: 25 },
    { name: 'cherry', age: 35 },
  ];

  it('sorts ascending by string', () => {
    const sorted = [...data].sort(getComparator('asc', 'name'));
    expect(sorted.map((d) => d.name)).toEqual(['apple', 'banana', 'cherry']);
  });

  it('sorts descending by string', () => {
    const sorted = [...data].sort(getComparator('desc', 'name'));
    expect(sorted.map((d) => d.name)).toEqual(['cherry', 'banana', 'apple']);
  });

  it('sorts ascending by number', () => {
    const sorted = [...data].sort(getComparator('asc', 'age'));
    expect(sorted.map((d) => d.age)).toEqual([25, 30, 35]);
  });

  it('sorts descending by number', () => {
    const sorted = [...data].sort(getComparator('desc', 'age'));
    expect(sorted.map((d) => d.age)).toEqual([35, 30, 25]);
  });
});
