import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AcademyLessonItem } from './academy-lesson-item';

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

const lesson = {
  id: 'l1',
  title: 'Welcome lesson',
  videoUrl: '',
  durationMinutes: 5,
  description: '',
};

describe('AcademyLessonItem', () => {
  it('renders lesson title with index', () => {
    renderWithTheme(
      <AcademyLessonItem
        lesson={lesson}
        index={0}
        active={false}
        progress={{ percent: 0, completed: false, updatedAt: 0 }}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByText('1. Welcome lesson')).toBeInTheDocument();
  });

  it('shows completed icon and label when completed', () => {
    renderWithTheme(
      <AcademyLessonItem
        lesson={lesson}
        index={0}
        active={false}
        progress={{ percent: 100, completed: true, updatedAt: 1 }}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByTestId('icon-solar:check-circle-bold')).toBeInTheDocument();
    expect(screen.getByText('academyModule.lesson.completed')).toBeInTheDocument();
  });

  it('shows in-progress percent when partially watched', () => {
    renderWithTheme(
      <AcademyLessonItem
        lesson={lesson}
        index={1}
        active={false}
        progress={{ percent: 40, completed: false, updatedAt: 1 }}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByTestId('icon-solar:play-circle-bold')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('shows lock icon and notStarted label when no progress', () => {
    renderWithTheme(
      <AcademyLessonItem
        lesson={lesson}
        index={0}
        active={false}
        progress={{ percent: 0, completed: false, updatedAt: 0 }}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByTestId('icon-solar:lock-password-outline')).toBeInTheDocument();
    expect(screen.getByText('academyModule.lesson.notStarted')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    renderWithTheme(
      <AcademyLessonItem
        lesson={lesson}
        index={0}
        active={false}
        progress={{ percent: 0, completed: false, updatedAt: 0 }}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
