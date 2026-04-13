import { render, screen } from '@testing-library/react';

import { Providers } from './providers';

jest.mock('src/locales', () => ({
  TranslateProvider: ({ children }: any) => <div data-testid="translate-provider">{children}</div>,
}));

jest.mock('src/components/snackbar', () => ({
  Snackbar: () => null,
}));

describe('Providers', () => {
  it('renders children', () => {
    render(<Providers><div data-testid="child">child</div></Providers>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
