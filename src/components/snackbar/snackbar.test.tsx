jest.mock('../iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-icon={icon} />,
}));
jest.mock('./styles', () => ({
  SnackbarRoot: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));
jest.mock('./classes', () => ({
  snackbarClasses: {
    root: 'snackbar-root',
    toast: 'snackbar-toast',
    icon: 'snackbar-icon',
    loader: 'snackbar-loader',
    loading: 'snackbar-loading',
    content: 'snackbar-content',
    title: 'snackbar-title',
    description: 'snackbar-description',
    closeButton: 'snackbar-close',
    actionButton: 'snackbar-action',
    cancelButton: 'snackbar-cancel',
    info: 'snackbar-info',
    error: 'snackbar-error',
    success: 'snackbar-success',
    warning: 'snackbar-warning',
    loadingIcon: 'snackbar-loading-icon',
    iconSvg: 'snackbar-icon-svg',
  },
}));

import React from 'react';
import { render } from '@testing-library/react';

import { Snackbar } from './snackbar';

describe('Snackbar', () => {
  it('renders without crashing', () => {
    const { container } = render(<Snackbar />);
    expect(container).toBeInTheDocument();
  });
});
