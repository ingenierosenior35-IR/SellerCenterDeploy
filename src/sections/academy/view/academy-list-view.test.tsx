import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AcademyListView } from './academy-list-view';

let mockStatus: { status: string } = { status: 'PENDING' };

jest.mock('src/hooks/seller/use-seller-status', () => ({
  useSellerStatus: () => mockStatus,
}));

jest.mock('src/hooks/academy/use-academy-progress', () => ({
  useAcademyProgress: () => ({
    getCourseProgress: () => 0,
    getResumePoint: () => undefined,
  }),
}));

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    home: { root: '/home' },
    academy: {
      root: '/academy',
      course: (id: string) => `/academy/${id}`,
      lesson: (c: string, l: string) => `/academy/${c}/lesson/${l}`,
    },
  },
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (key: string) => key,
    currentLang: 'es',
  }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock('src/components/label', () => ({
  Label: ({ children }: any) => <span>{children}</span>,
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <h1 data-testid="breadcrumbs">{heading}</h1>,
}));

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AcademyListView', () => {
  it('renders breadcrumbs and the list heading', () => {
    mockStatus = { status: 'PENDING' };
    renderWithTheme(<AcademyListView />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('academyModule.list.heading')).toBeInTheDocument();
  });

  it('hides advanced courses for non-approved sellers', () => {
    mockStatus = { status: 'PENDING' };
    renderWithTheme(<AcademyListView />);
    // The advanced course title key shouldn't be present.
    expect(
      screen.queryByText('academyModule.courses.advancedGrowth.title')
    ).not.toBeInTheDocument();
    expect(screen.getByText('academyModule.courses.gettingStarted.title')).toBeInTheDocument();
  });

  it('includes advanced courses when seller status is APPROVED', () => {
    mockStatus = { status: 'APPROVED' };
    renderWithTheme(<AcademyListView />);
    expect(screen.getByText('academyModule.courses.advancedGrowth.title')).toBeInTheDocument();
  });

  it.each(['PENDING', 'PROCESSING', 'DISABLED', 'DENIED'])(
    'always shows the base courses for status %s',
    (status) => {
      mockStatus = { status };
      renderWithTheme(<AcademyListView />);
      expect(screen.getByText('academyModule.courses.gettingStarted.title')).toBeInTheDocument();
      expect(
        screen.getByText('academyModule.courses.catalogManagement.title')
      ).toBeInTheDocument();
    }
  );
});
