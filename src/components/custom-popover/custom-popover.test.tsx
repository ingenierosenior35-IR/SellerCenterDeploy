jest.mock('minimal-shared/utils', () => ({
  mergeRefs: jest.fn(([ref]: any[]) => ref),
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));
jest.mock('../iconify', () => ({
  Iconify: ({ icon }: { icon: string }) => <span data-icon={icon} />,
}));
jest.mock('./styles', () => ({
  Arrow: () => <div data-testid="arrow" />,
  getPaperOffsetStyles: jest.fn(() => ({})),
}));
jest.mock('./hooks', () => ({
  useElementRect: jest.fn(() => null),
}));
jest.mock('./utils', () => ({
  getPopoverOrigin: jest.fn(() => ({
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    transformOrigin: { vertical: 'top', horizontal: 'left' },
  })),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';

import { CustomPopover } from './custom-popover';

describe('CustomPopover', () => {
  it('renders children when open', () => {
    render(
      <CustomPopover open anchorEl={document.body}>
        <span>Popover Content</span>
      </CustomPopover>
    );
    expect(screen.getByText('Popover Content')).toBeInTheDocument();
  });

  it('does not render children when closed', () => {
    render(
      <CustomPopover open={false} anchorEl={null}>
        <span>Hidden Content</span>
      </CustomPopover>
    );
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });
});
