import { applyFilter, flattenNavSections } from './utils';

describe('searchbar utils', () => {
  describe('flattenNavSections', () => {
    it('flattens sections and nested items with grouped path labels', () => {
      const result = flattenNavSections([
        {
          subheader: 'Dashboard',
          items: [
            {
              title: 'Products',
              path: '/products',
              children: [{ title: 'Create', path: '/products/create' }],
            },
          ],
        },
      ] as any);

      expect(result).toEqual([
        { title: 'Products', path: '/products', group: 'Dashboard' },
        { title: 'Create', path: '/products/create', group: 'Dashboard.Products' },
      ]);
    });
  });

  describe('applyFilter', () => {
    const inputData = [
      { title: 'Products', path: '/products', group: 'Dashboard' },
      { title: 'Returns', path: '/returns', group: 'Operations' },
    ];

    it('returns all items when query is empty', () => {
      expect(applyFilter({ inputData, query: '' })).toEqual(inputData);
    });

    it('filters by title, path or group without case sensitivity', () => {
      expect(applyFilter({ inputData, query: 'produc' })).toEqual([inputData[0]]);
      expect(applyFilter({ inputData, query: '/returns' })).toEqual([inputData[1]]);
      expect(applyFilter({ inputData, query: 'dashboard' })).toEqual([inputData[0]]);
    });
  });
});
