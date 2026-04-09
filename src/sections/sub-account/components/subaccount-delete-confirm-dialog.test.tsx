import { render, screen, fireEvent } from '@testing-library/react';

import { SubAccountDeleteConfirmDialog } from './subaccount-delete-confirm-dialog';

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
  }),
}));

describe('SubAccountDeleteConfirmDialog', () => {
  it('renders translated content including sub account name', () => {
    render(
      <SubAccountDeleteConfirmDialog
        open
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        subAccountName="Jane Doe"
      />
    );

    expect(screen.getByText('subAccountListView.deleteSubAccount.title')).toBeInTheDocument();
    expect(
      screen.getByText('subAccountListView.deleteSubAccount.content Jane Doe')
    ).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = jest.fn();

    render(
      <SubAccountDeleteConfirmDialog open onClose={jest.fn()} onConfirm={onConfirm} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'subAccountListView.deleteSubAccount.confirmButton' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
