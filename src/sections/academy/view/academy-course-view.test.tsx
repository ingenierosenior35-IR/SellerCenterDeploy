import { act, render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AcademyCourseView } from './academy-course-view';

const setLessonProgress = jest.fn();
const markLessonComplete = jest.fn();
const getResumePoint = jest.fn();

jest.mock('src/hooks/academy/use-academy-progress', () => ({
  useAcademyProgress: () => ({
    setLessonProgress,
    markLessonComplete,
    getLessonProgress: () => ({ percent: 0, completed: false, updatedAt: 0 }),
    getCourseProgress: () => 25,
    getResumePoint,
  }),
}));

const mockPush = jest.fn();

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ push: mockPush }),
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

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
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

jest.mock('src/components/empty-content', () => ({
  EmptyContent: ({ title, action }: any) => (
    <div data-testid="empty-content">
      {title}
      {action}
    </div>
  ),
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <h1 data-testid="breadcrumbs">{heading}</h1>,
}));

// Stub the video player so tests don't drive its setInterval logic.
jest.mock('../components/academy-video-player', () => ({
  AcademyVideoPlayer: ({ title }: any) => <div data-testid="video-player">{title}</div>,
}));

const theme = createTheme({ cssVariables: true });
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AcademyCourseView', () => {
  beforeEach(() => {
    setLessonProgress.mockClear();
    markLessonComplete.mockClear();
    mockPush.mockClear();
    getResumePoint.mockReturnValue(undefined);
  });

  it('renders an empty state for an unknown course id', () => {
    renderWithTheme(<AcademyCourseView courseId="missing" />);
    expect(screen.getByTestId('empty-content')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /backToList/i }));
    expect(mockPush).toHaveBeenCalledWith('/academy');
  });

  it('renders the first lesson by default', () => {
    renderWithTheme(<AcademyCourseView courseId="getting-started" />);
    expect(screen.getByTestId('video-player')).toHaveTextContent(
      'Bienvenido a Miti Miti Seller Center'
    );
  });

  it('jumps to a deep-linked lesson when initialLessonId is provided', () => {
    renderWithTheme(
      <AcademyCourseView courseId="getting-started" initialLessonId="navigation" />
    );
    expect(screen.getByTestId('video-player')).toHaveTextContent('Navegación por los módulos');
  });

  it('uses the resume point when it matches the current course', () => {
    getResumePoint.mockReturnValue({
      courseId: 'getting-started',
      lessonId: 'profile-setup',
      updatedAt: 1,
    });
    renderWithTheme(<AcademyCourseView courseId="getting-started" />);
    expect(screen.getByTestId('video-player')).toHaveTextContent('Configura tu perfil de vendedor');
  });

  it('marks the lesson as complete and advances to the next one when the button is clicked', () => {
    renderWithTheme(<AcademyCourseView courseId="getting-started" />);
    fireEvent.click(screen.getByRole('button', { name: /markComplete/i }));
    expect(markLessonComplete).toHaveBeenCalledWith('getting-started', 'welcome');
    // Advances to the next lesson
    expect(screen.getByTestId('video-player')).toHaveTextContent('Configura tu perfil de vendedor');
  });

  it('switches the active lesson when a sidebar item is clicked', () => {
    renderWithTheme(<AcademyCourseView courseId="getting-started" />);
    const navigationItem = screen.getByText(/3\. Navegación por los módulos/);
    act(() => {
      fireEvent.click(navigationItem);
    });
    expect(screen.getByTestId('video-player')).toHaveTextContent('Navegación por los módulos');
  });

  it('renders the course progress label and percentage', () => {
    renderWithTheme(<AcademyCourseView courseId="getting-started" />);
    expect(screen.getByText('academyModule.course.progressLabel')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
  });
});
