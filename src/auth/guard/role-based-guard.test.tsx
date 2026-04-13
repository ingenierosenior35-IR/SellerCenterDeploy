import { render, screen } from '@testing-library/react';

import { RoleBasedGuard } from './role-based-guard';

jest.mock('src/components/animate', () => ({
  MotionContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  varBounce: () => ({}),
}));

jest.mock('src/assets/illustrations', () => ({
  ForbiddenIllustration: () => <div data-testid="forbidden-illustration" />,
}));

jest.mock('framer-motion', () => ({
  m: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

describe('RoleBasedGuard', () => {
  it('renders children when role is allowed', () => {
    render(
      <RoleBasedGuard currentRole="admin" allowedRoles={['admin', 'editor']}>
        <div>secured content</div>
      </RoleBasedGuard>
    );

    expect(screen.getByText('secured content')).toBeInTheDocument();
  });

  it('renders nothing when role is not allowed and hasContent is false', () => {
    const { container } = render(
      <RoleBasedGuard currentRole="viewer" allowedRoles={['admin']} hasContent={false}>
        <div>secured content</div>
      </RoleBasedGuard>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders permission denied content when role is not allowed and hasContent is true', () => {
    render(
      <RoleBasedGuard currentRole="viewer" allowedRoles={['admin']} hasContent>
        <div>secured content</div>
      </RoleBasedGuard>
    );

    expect(screen.getByText('Permission denied')).toBeInTheDocument();
    expect(screen.getByText('You do not have permission to access this page.')).toBeInTheDocument();
    expect(screen.getByTestId('forbidden-illustration')).toBeInTheDocument();
  });
});
