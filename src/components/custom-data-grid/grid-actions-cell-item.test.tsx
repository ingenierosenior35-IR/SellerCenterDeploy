jest.mock('src/routes/components', () => ({
  RouterLink: 'a',
}));

const isExternalLink = jest.fn((href: string) => href.startsWith('http'));

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
  isExternalLink: (...args: any[]) => isExternalLink(...args),
}));

const gridActionsCellItemMock = jest.fn();

jest.mock('@mui/x-data-grid', () => ({
  GridActionsCellItem: ({ label, showInMenu, ...props }: any) => {
    gridActionsCellItemMock({ label, showInMenu, ...props });
    return <button {...props}>{label}</button>;
  },
}));
jest.mock('@mui/material/Link', () => 'a');

import React from 'react';
import { render, screen } from '@testing-library/react';

import { CustomGridActionsCellItem } from './grid-actions-cell-item';

describe('CustomGridActionsCellItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders action item without href', () => {
    render(
      <CustomGridActionsCellItem
        label="Edit"
        icon={<span />}
        onClick={jest.fn()}
        showInMenu={false}
      />
    );
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(isExternalLink).not.toHaveBeenCalled();
  });

  it('renders action item with showInMenu=false', () => {
    render(
      <CustomGridActionsCellItem
        label="Delete"
        icon={<span />}
        onClick={jest.fn()}
        showInMenu={false}
      />
    );
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders internal href link props', () => {
    render(
      <CustomGridActionsCellItem
        label="View"
        icon={<span />}
        href="/product/1"
        showInMenu={false}
      />
    );
    const button = screen.getByRole('button', { name: 'View' });
    expect(button).toBeInTheDocument();
    expect(isExternalLink).toHaveBeenCalledWith('/product/1');
    const props = gridActionsCellItemMock.mock.calls.at(-1)?.[0];
    expect(props.href).toBe('/product/1');
    expect(props.target).toBeUndefined();
  });

  it('renders external href in menu mode', () => {
    const { container } = render(
      <CustomGridActionsCellItem
        label="Docs"
        icon={<span />}
        href="https://example.com"
        showInMenu
      />
    );
    const button = screen.getByRole('button', { name: 'Docs' });
    expect(button).toBeInTheDocument();
    expect(isExternalLink).toHaveBeenCalledWith('https://example.com');
    const props = gridActionsCellItemMock.mock.calls.at(-1)?.[0];
    expect(props.target).toBe('_blank');
    expect(props.rel).toBe('noopener noreferrer');
    expect(container.querySelector('li.MuiMenuItem-root')).toContainElement(button);
  });
});
