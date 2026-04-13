import React from 'react';

jest.mock('simplebar-react', () => ({
    __esModule: true,
    default: React.forwardRef(({ children, scrollableNodeProps, ...props }: any, ref: any) => (
      <div ref={ref} {...props}>{children}</div>
    )),
  }));
jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (...args: any[]) => args.flat().filter(Boolean).join(' '),
}));

import { render, screen } from '@testing-library/react';

import { Scrollbar } from './scrollbar';

describe('Scrollbar', () => {
  it('renders children', () => {
    render(<Scrollbar><span>Content inside scrollbar</span></Scrollbar>);
    expect(screen.getByText('Content inside scrollbar')).toBeInTheDocument();
  });

  it('applies className', () => {
    const { container } = render(<Scrollbar className="my-scrollbar"><span>text</span></Scrollbar>);
    expect(container.querySelector('.my-scrollbar')).toBeInTheDocument();
  });
});
