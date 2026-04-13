import { render, screen, fireEvent } from '@testing-library/react';

import { NavList } from './nav-mobile-list';

const mockOnToggle = jest.fn();
const mockUseBoolean = jest.fn();
const mockUsePathname = jest.fn();

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: (...args: any[]) => mockUseBoolean(...args),
}));

jest.mock('minimal-shared/utils', () => ({
  varAlpha: () => 'rgba(0 0 0 / 0.12)',
  isActiveLink: () => true,
  isExternalLink: (path: string) => path.startsWith('http'),
}));

jest.mock('src/routes/hooks', () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock('@mui/material/Collapse', () => ({
  __esModule: true,
  default: ({ children, in: inProp }: { children: React.ReactNode; in?: boolean }) =>
    inProp ? <div data-testid="mobile-collapse">{children}</div> : null,
}));

jest.mock('src/components/nav-section', () => ({
  navSectionClasses: { item: { title: 'title' } },
  NavSectionVertical: ({ data, slotProps }: { data: any[]; slotProps?: any }) => {
    const theme = { vars: { palette: { grey: { '500Channel': '125 125 125' } } } };
    const rootSx = slotProps?.rootItem?.sx ?? [];
    (Array.isArray(rootSx) ? rootSx : [rootSx]).forEach((entry: any) => {
      if (typeof entry === 'function') entry(theme);
    });

    return <div data-testid="mobile-vertical-section">{data.map((entry) => entry.subheader).join(',')}</div>;
  },
}));

jest.mock('../components', () => ({
  NavLi: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
}));

jest.mock('./nav-mobile-item', () => ({
  NavItem: ({ title, onClick, hasChild, externalLink }: any) => (
    <button
      type="button"
      data-has-child={String(Boolean(hasChild))}
      data-external-link={String(Boolean(externalLink))}
      onClick={onClick}
    >
      {title}
    </button>
  ),
}));

describe('NavList (mobile)', () => {
  beforeEach(() => {
    mockOnToggle.mockReset();
    mockUseBoolean.mockReset();
    mockUsePathname.mockReset();
    mockUsePathname.mockReturnValue('/dashboard');
    mockUseBoolean.mockReturnValue({ value: true, onToggle: mockOnToggle });
  });

  it('initializes useBoolean with children presence and toggles on click', () => {
    render(
      <NavList
        data={{
          title: 'Dashboard',
          path: '/dashboard',
          children: [{ subheader: 'Group', items: [{ title: 'Analytics', path: '/analytics' }] }],
        }}
      />
    );

    expect(mockUseBoolean).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole('button', { name: 'Dashboard' }));

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute('data-has-child', 'true');
    expect(screen.getByTestId('mobile-vertical-section')).toHaveTextContent('Group');
  });

  it('passes external-link flag to nav item', () => {
    mockUseBoolean.mockReturnValue({ value: false, onToggle: mockOnToggle });

    render(<NavList data={{ title: 'Store', path: 'https://store.example.com' }} />);

    expect(mockUseBoolean).toHaveBeenCalledWith(false);
    expect(screen.getByRole('button', { name: 'Store' })).toHaveAttribute('data-external-link', 'true');
  });
});
