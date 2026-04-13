import { render, screen } from '@testing-library/react';

import { AuthSplitContent } from './content';

jest.mock('minimal-shared/utils', () => ({
  mergeClasses: (classes: Array<string | undefined>) => classes.filter(Boolean).join(' '),
}));

jest.mock('../core', () => ({
  layoutClasses: { content: 'minimal__layout__main__content' },
}));

describe('AuthSplitContent', () => {
  it('renders children in content area', () => {
    render(
      <AuthSplitContent>
        <span>Auth child</span>
      </AuthSplitContent>
    );

    expect(screen.getByText('Auth child')).toBeInTheDocument();
  });

  it('merges layout content class with custom class', () => {
    const { container } = render(<AuthSplitContent className="auth-content">Body</AuthSplitContent>);

    expect(container.firstChild).toHaveClass('minimal__layout__main__content');
    expect(container.firstChild).toHaveClass('auth-content');
  });
});
