import React from 'react';
import { render, screen } from '@testing-library/react';

import { TableEmptyRows } from './table-empty-rows';

describe('TableEmptyRows', () => {
  it('renders nothing when emptyRows is 0', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableEmptyRows emptyRows={0} />
        </tbody>
      </table>
    );
    expect(container.querySelectorAll('tr')).toHaveLength(0);
  });

  it('renders a row when emptyRows > 0', () => {
    render(
      <table>
        <tbody>
          <TableEmptyRows emptyRows={3} />
        </tbody>
      </table>
    );
    expect(screen.getByRole('row')).toBeInTheDocument();
  });
});
