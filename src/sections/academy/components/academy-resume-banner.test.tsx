import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AcademyResumeBanner } from './academy-resume-banner';

const mockPush = jest.fn();

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('src/routes/paths', () => ({
  paths: {
    academy: {
      lesson: (c: string, l: string) => `/academy/${c}/lesson/${l}`,
    },
  },
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

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AcademyResumeBanner', () => {
  beforeEach(() => mockPush.mockClear());

  it('renders nothing when there is no resume point', () => {
    const { container } = renderWithTheme(<AcademyResumeBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing for an unknown course id', () => {
    const { container } = renderWithTheme(
      <AcademyResumeBanner resumePoint={{ courseId: 'does-not-exist', lessonId: 'x' }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing for an unknown lesson id within a known course', () => {
    const { container } = renderWithTheme(
      <AcademyResumeBanner resumePoint={{ courseId: 'getting-started', lessonId: 'no-id' }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the resume banner with the lesson title and CTA', () => {
    renderWithTheme(
      <AcademyResumeBanner resumePoint={{ courseId: 'getting-started', lessonId: 'welcome' }} />
    );
    expect(screen.getByText(/Bienvenido a Miti Miti/i)).toBeInTheDocument();
    expect(screen.getByText('academyModule.resume.cta')).toBeInTheDocument();
  });

  it('navigates to the lesson when CTA is clicked', () => {
    renderWithTheme(
      <AcademyResumeBanner resumePoint={{ courseId: 'getting-started', lessonId: 'welcome' }} />
    );
    fireEvent.click(screen.getByRole('button', { name: /resume/i }));
    expect(mockPush).toHaveBeenCalledWith('/academy/getting-started/lesson/welcome');
  });
});
