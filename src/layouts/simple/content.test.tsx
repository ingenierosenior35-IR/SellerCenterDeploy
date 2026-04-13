import { render, screen } from '@testing-library/react';

import { SimpleCompactContent } from './content';

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (classes: Array<string | undefined>) => classes.filter(Boolean).join(' '),
}));

jest.mock('../core', () => ({
  layoutClasses: { content: 'minimal__layout__main__content' },
}));

describe('SimpleCompactContent', () => {
  it('renders children', () => {
    render(
      <SimpleCompactContent>
        <span>Simple child</span>
      </SimpleCompactContent>
    );

    expect(screen.getByText('Simple child')).toBeInTheDocument();
  });

  it('merges layout content class with custom class', () => {
    const { container } = render(
      <SimpleCompactContent className="custom-content">Body</SimpleCompactContent>
    );

    expect(container.firstChild).toHaveClass('minimal__layout__main__content');
    expect(container.firstChild).toHaveClass('custom-content');
  });
});
