'use client';

import Button from '@mui/material/Button';

import { useTranslate } from 'src/locales';

import { ConfirmDialog } from 'src/components/custom-dialog';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  subAccountName?: string;
};

export function SubAccountDeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  isDeleting = false,
  subAccountName,
}: Props) {
  const { translate } = useTranslate();

  const content = subAccountName
    ? `${translate('subAccountListView.deleteSubAccount.content')} ${subAccountName}`
    : translate('subAccountListView.deleteSubAccount.content');

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={translate('subAccountListView.deleteSubAccount.title')}
      content={content}
      action={
        <Button type="button" variant="contained" color="error" onClick={onConfirm} loading={isDeleting}>
          {translate('subAccountListView.deleteSubAccount.confirmButton')}
        </Button>
      }
    />
  );
}
