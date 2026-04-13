jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { TablePaginationCustom } from './table-pagination-custom';

describe('TablePaginationCustom', () => {
  const defaultProps = {
    count: 100,
    page: 0,
    rowsPerPage: 10,
    onPageChange: jest.fn(),
  };

  it('renders table pagination', () => {
    render(<TablePaginationCustom {...defaultProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders dense switch when onChangeDense is provided', () => {
    render(<TablePaginationCustom {...defaultProps} onChangeDense={jest.fn()} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('does not render dense switch when onChangeDense is not provided', () => {
    render(<TablePaginationCustom {...defaultProps} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
