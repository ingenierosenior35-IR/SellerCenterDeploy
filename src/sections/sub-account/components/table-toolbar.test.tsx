import type { ReactNode } from 'react';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { AccountTableFiltersInterface } from 'src/interfaces';

import { render, screen, fireEvent } from '@testing-library/react';

import { SubAccountTableToolbar } from './table-toolbar';

jest.mock('minimal-shared/hooks', () => ({
  usePopover: () => ({
    open: false,
    anchorEl: null,
    onOpen: jest.fn(),
    onClose: jest.fn(),
  }),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
  }),
}));

jest.mock('src/components/custom-popover', () => ({
  CustomPopover: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: () => <span data-testid="iconify" />,
}));


describe('SubAccountTableToolbar', () => {
  it('updates filter name and resets page when user types in search input', () => {
    const onResetPage = jest.fn();
    const setState = jest.fn();

    const filters: UseSetStateReturn<AccountTableFiltersInterface> = {
      state: {
        name: '',
        permission: 'all',
      },
      setState,
      setField: jest.fn(),
      canReset: false,
      resetState: jest.fn(),
      onResetState: jest.fn(),
    } as unknown as UseSetStateReturn<AccountTableFiltersInterface>;

    render(<SubAccountTableToolbar filters={filters} onResetPage={onResetPage} />);

    const input = screen.getByPlaceholderText('subAccountListView.searchPlaceholder');
    fireEvent.change(input, { target: { value: 'john' } });

    expect(onResetPage).toHaveBeenCalledTimes(1);
    expect(setState).toHaveBeenCalledWith({ name: 'john' });
  });
});
