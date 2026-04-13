import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { TableSelectedAction } from './table-selected-action';

describe('TableSelectedAction', () => {
  it('renders nothing when numSelected is 0', () => {
    const { container } = render(
      <TableSelectedAction
        rowCount={5}
        numSelected={0}
        onSelectAllRows={jest.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders when numSelected > 0', () => {
    render(
      <TableSelectedAction
        rowCount={5}
        numSelected={2}
        onSelectAllRows={jest.fn()}
      />
    );
    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  it('renders action node when provided', () => {
    render(
      <TableSelectedAction
        rowCount={5}
        numSelected={2}
        onSelectAllRows={jest.fn()}
        action={<button>Delete</button>}
      />
    );
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('calls onSelectAllRows when checkbox is changed', () => {
    const onSelectAllRows = jest.fn();
    render(
      <TableSelectedAction
        rowCount={5}
        numSelected={2}
        onSelectAllRows={onSelectAllRows}
      />
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(onSelectAllRows).toHaveBeenCalled();
  });
});
