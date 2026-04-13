import { render, screen } from '@testing-library/react';

import { NotFoundView } from './not-found-view';

jest.mock('framer-motion', () => ({
  m: { div: ({ children }: any) => <div>{children}</div> },
}));

jest.mock('src/layouts/simple', () => ({
  SimpleLayout: ({ children }: any) => <div data-testid="simple-layout">{children}</div>,
}));

jest.mock('src/routes/components', () => ({
  RouterLink: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

jest.mock('src/assets/illustrations', () => ({
  PageNotFoundIllustration: () => <div data-testid="not-found-illustration" />,
}));

jest.mock('src/components/animate', () => ({
  varBounce: () => ({}),
  MotionContainer: ({ children }: any) => <div>{children}</div>,
}));

describe('NotFoundView', () => {
  it('renders the not-found heading', () => {
    render(<NotFoundView />);
    expect(screen.getByText(/sorry, page not found/i)).toBeInTheDocument();
  });

  it('renders a link to home', () => {
    render(<NotFoundView />);
    const link = screen.getByRole('link', { name: /go to home/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the page not found illustration', () => {
    render(<NotFoundView />);
    expect(screen.getByTestId('not-found-illustration')).toBeInTheDocument();
  });

  it('renders within simple layout', () => {
    render(<NotFoundView />);
    expect(screen.getByTestId('simple-layout')).toBeInTheDocument();
  });
});
