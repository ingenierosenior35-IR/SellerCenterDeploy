import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { TableHeadCustom } from './table-head-custom';

const headCells = [
  { id: 'name', label: 'Name' },
  { id: 'age', label: 'Age' },
];

describe('TableHeadCustom', () => {
  it('renders head cells', () => {
    render(
      <table>
        <TableHeadCustom headCells={headCells} />
      </table>
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders sort labels when onSort is provided', () => {
    render(
      <table>
        <TableHeadCustom headCells={headCells} onSort={jest.fn()} orderBy="name" order="asc" />
      </table>
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('calls onSort when header cell is clicked', () => {
    const onSort = jest.fn();
    render(
      <table>
        <TableHeadCustom headCells={headCells} onSort={onSort} orderBy="name" order="asc" />
      </table>
    );
    fireEvent.click(screen.getByText('Name'));
    expect(onSort).toHaveBeenCalledWith('name');
  });

  it('renders checkbox when onSelectAllRows is provided', () => {
    render(
      <table>
        <TableHeadCustom headCells={headCells} onSelectAllRows={jest.fn()} rowCount={5} numSelected={0} />
      </table>
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('calls onSelectAllRows when select-all checkbox is changed', () => {
    const onSelectAllRows = jest.fn();
    render(
      <table>
        <TableHeadCustom headCells={headCells} onSelectAllRows={onSelectAllRows} rowCount={5} numSelected={0} />
      </table>
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onSelectAllRows).toHaveBeenCalled();
  });
});
