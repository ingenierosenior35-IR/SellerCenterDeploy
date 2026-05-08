import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AcademyCourseCard } from './academy-course-card';

const mockPush = jest.fn();

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('src/routes/paths', () => ({
  paths: { academy: { course: (id: string) => `/academy/${id}` } },
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

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const courseFixture = {
  id: 'c1',
  titleKey: 'academyModule.courses.gettingStarted.title',
  descriptionKey: 'academyModule.courses.gettingStarted.description',
  thumbnail: '/x.svg',
  level: 'beginner' as const,
  lessons: [
    { id: 'l1', title: 'Lesson 1', videoUrl: '', durationMinutes: 5, description: '' },
    { id: 'l2', title: 'Lesson 2', videoUrl: '', durationMinutes: 7, description: '' },
  ],
};

describe('AcademyCourseCard', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders title, description and progress', () => {
    renderWithTheme(<AcademyCourseCard course={courseFixture} progress={42} />);

    expect(screen.getByText('academyModule.courses.gettingStarted.title')).toBeInTheDocument();
    expect(
      screen.getByText('academyModule.courses.gettingStarted.description')
    ).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('shows the lesson count and total minutes', () => {
    renderWithTheme(<AcademyCourseCard course={courseFixture} progress={0} />);
    expect(screen.getByText(/2 academyModule.card.lessons/i)).toBeInTheDocument();
    expect(screen.getByText(/12 academyModule.card.minutes/i)).toBeInTheDocument();
  });

  it('navigates to the course detail when clicked', () => {
    renderWithTheme(<AcademyCourseCard course={courseFixture} progress={0} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockPush).toHaveBeenCalledWith('/academy/c1');
  });

  it('renders the level label', () => {
    renderWithTheme(<AcademyCourseCard course={courseFixture} progress={0} />);
    expect(screen.getByText('academyModule.levels.beginner')).toBeInTheDocument();
  });
});
