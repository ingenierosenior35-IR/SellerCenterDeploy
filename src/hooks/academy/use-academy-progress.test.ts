import { act, renderHook } from '@testing-library/react';

import { useAcademyProgress } from './use-academy-progress';

const STORAGE_KEY = 'academy_progress_v1';

describe('useAcademyProgress', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns zero-progress for unknown lessons', () => {
    const { result } = renderHook(() => useAcademyProgress());
    const record = result.current.getLessonProgress('any', 'any');
    expect(record).toEqual({ percent: 0, completed: false, updatedAt: 0 });
  });

  it('persists progress to localStorage when setLessonProgress is called', () => {
    const { result } = renderHook(() => useAcademyProgress());

    act(() => {
      result.current.setLessonProgress('course-1', 'lesson-1', 35);
    });

    expect(result.current.getLessonProgress('course-1', 'lesson-1').percent).toBe(35);
    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}');
    expect(persisted.lessons['course-1::lesson-1'].percent).toBe(35);
    expect(persisted.lastViewed).toMatchObject({ courseId: 'course-1', lessonId: 'lesson-1' });
  });

  it('never decreases progress when a smaller percent is reported', () => {
    const { result } = renderHook(() => useAcademyProgress());

    act(() => {
      result.current.setLessonProgress('c', 'l', 60);
    });
    act(() => {
      result.current.setLessonProgress('c', 'l', 20);
    });

    expect(result.current.getLessonProgress('c', 'l').percent).toBe(60);
  });

  it('marks as completed when percent crosses 95', () => {
    const { result } = renderHook(() => useAcademyProgress());

    act(() => {
      result.current.setLessonProgress('c', 'l', 96);
    });

    expect(result.current.getLessonProgress('c', 'l').completed).toBe(true);
  });

  it('markLessonComplete sets percent to 100 and completed=true', () => {
    const { result } = renderHook(() => useAcademyProgress());

    act(() => {
      result.current.markLessonComplete('c', 'l');
    });

    const record = result.current.getLessonProgress('c', 'l');
    expect(record.percent).toBe(100);
    expect(record.completed).toBe(true);
  });

  it('getCourseProgress averages lesson progress (completed = 100)', () => {
    const { result } = renderHook(() => useAcademyProgress());

    act(() => {
      result.current.markLessonComplete('c', 'l1');
      result.current.setLessonProgress('c', 'l2', 50);
    });

    expect(result.current.getCourseProgress('c', ['l1', 'l2', 'l3'])).toBe(50);
  });

  it('getCourseProgress returns 0 for empty lesson list', () => {
    const { result } = renderHook(() => useAcademyProgress());
    expect(result.current.getCourseProgress('c', [])).toBe(0);
  });

  it('getResumePoint reflects the latest viewed lesson', () => {
    const { result } = renderHook(() => useAcademyProgress());

    act(() => {
      result.current.setLessonProgress('c1', 'l1', 10);
      result.current.setLessonProgress('c2', 'l5', 10);
    });

    expect(result.current.getResumePoint()).toMatchObject({ courseId: 'c2', lessonId: 'l5' });
  });

  it('rehydrates persisted state on mount', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lessons: { 'c::l': { percent: 75, completed: false, updatedAt: 1 } },
        lastViewed: { courseId: 'c', lessonId: 'l', updatedAt: 1 },
      })
    );

    const { result } = renderHook(() => useAcademyProgress());

    expect(result.current.getLessonProgress('c', 'l').percent).toBe(75);
    expect(result.current.getResumePoint()).toMatchObject({ courseId: 'c', lessonId: 'l' });
  });

  it('returns empty state when localStorage contains malformed data', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not-json');
    const { result } = renderHook(() => useAcademyProgress());
    expect(result.current.getLessonProgress('c', 'l').percent).toBe(0);
  });

  it('clamps percent above 100 and below 0', () => {
    const { result } = renderHook(() => useAcademyProgress());

    act(() => {
      result.current.setLessonProgress('c', 'l', 250);
    });
    expect(result.current.getLessonProgress('c', 'l').percent).toBe(100);

    act(() => {
      result.current.resetProgress();
      result.current.setLessonProgress('c', 'l', -50);
    });
    expect(result.current.getLessonProgress('c', 'l').percent).toBe(0);
  });

  it('resetProgress clears all stored progress', () => {
    const { result } = renderHook(() => useAcademyProgress());

    act(() => {
      result.current.setLessonProgress('c', 'l', 80);
      result.current.resetProgress();
    });

    expect(result.current.getLessonProgress('c', 'l').percent).toBe(0);
    expect(result.current.getResumePoint()).toBeUndefined();
  });
});
