import React from 'react';
import { render } from '@testing-library/react';

import { TableSkeleton } from './table-skeleton';

describe('TableSkeleton', () => {
  it('renders correct number of rows', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableSkeleton rowCount={3} cellCount={4} />
        </tbody>
      </table>
    );
    expect(container.querySelectorAll('tr')).toHaveLength(3);
  });

  it('renders correct number of cells per row', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableSkeleton rowCount={2} cellCount={5} />
        </tbody>
      </table>
    );
    const rows = container.querySelectorAll('tr');
    rows.forEach((row) => {
      expect(row.querySelectorAll('td')).toHaveLength(5);
    });
  });

  it('renders no rows when rowCount is 0', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableSkeleton rowCount={0} cellCount={3} />
        </tbody>
      </table>
    );
    expect(container.querySelectorAll('tr')).toHaveLength(0);
  });
});
