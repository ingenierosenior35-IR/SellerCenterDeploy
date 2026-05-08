'use client';

import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------
// Persistencia de progreso de Academy.
//
// FUTURO: cuando el backend exponga mutations (`recordLessonProgress`,
// `recordCourseCompletion`), reemplazar la capa de localStorage por React
// Query. La interfaz pública del hook (getLessonProgress, setLessonProgress,
// markLessonComplete, getResumePoint, getCourseProgress) debe mantenerse
// estable para que los consumidores no cambien.
// ----------------------------------------------------------------------

const STORAGE_KEY = 'academy_progress_v1';

export interface AcademyLessonRecord {
  /** Porcentaje 0–100 visto del video. */
  percent: number;
  completed: boolean;
  updatedAt: number;
}

export interface AcademyResumePoint {
  courseId: string;
  lessonId: string;
  updatedAt: number;
}

interface AcademyProgressState {
  /** Estructura: lessons[`${courseId}::${lessonId}`] = AcademyLessonRecord. */
  lessons: Record<string, AcademyLessonRecord>;
  lastViewed?: AcademyResumePoint;
}

const EMPTY_STATE: AcademyProgressState = { lessons: {} };

const lessonKey = (courseId: string, lessonId: string) => `${courseId}::${lessonId}`;

const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readState = (): AcademyProgressState => {
  if (!isBrowser()) return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as AcademyProgressState;
    if (!parsed || typeof parsed !== 'object' || !parsed.lessons) return EMPTY_STATE;
    return parsed;
  } catch {
    return EMPTY_STATE;
  }
};

const writeState = (next: AcademyProgressState) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota llena, modo privado, etc. — fallar silenciosamente: el progreso
    // es nice-to-have, nunca debe romper la navegación.
  }
};

const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(Math.max(value, min), max);

// ----------------------------------------------------------------------

export const useAcademyProgress = () => {
  const [state, setState] = useState<AcademyProgressState>(EMPTY_STATE);

  // Hidratación: leer del storage solo en el cliente, una vez montado.
  useEffect(() => {
    setState(readState());
  }, []);

  const persist = useCallback((updater: (prev: AcademyProgressState) => AcademyProgressState) => {
    setState((prev) => {
      const next = updater(prev);
      writeState(next);
      return next;
    });
  }, []);

  const setLessonProgress = useCallback(
    (courseId: string, lessonId: string, percent: number) => {
      const safePercent = clamp(Math.round(percent));
      persist((prev) => {
        const key = lessonKey(courseId, lessonId);
        const previous = prev.lessons[key];
        // No retroceder progreso si el usuario re-mira el video desde el inicio.
        const finalPercent = previous ? Math.max(previous.percent, safePercent) : safePercent;
        return {
          lessons: {
            ...prev.lessons,
            [key]: {
              percent: finalPercent,
              completed: previous?.completed || finalPercent >= 95,
              updatedAt: Date.now(),
            },
          },
          lastViewed: { courseId, lessonId, updatedAt: Date.now() },
        };
      });
    },
    [persist]
  );

  const markLessonComplete = useCallback(
    (courseId: string, lessonId: string) => {
      persist((prev) => {
        const key = lessonKey(courseId, lessonId);
        return {
          lessons: {
            ...prev.lessons,
            [key]: { percent: 100, completed: true, updatedAt: Date.now() },
          },
          lastViewed: { courseId, lessonId, updatedAt: Date.now() },
        };
      });
    },
    [persist]
  );

  const getLessonProgress = useCallback(
    (courseId: string, lessonId: string): AcademyLessonRecord =>
      state.lessons[lessonKey(courseId, lessonId)] ?? {
        percent: 0,
        completed: false,
        updatedAt: 0,
      },
    [state.lessons]
  );

  /**
   * Devuelve un valor 0–100 con el progreso promedio del curso, ponderado
   * por completion (lección completa = 100, en progreso = percent actual).
   */
  const getCourseProgress = useCallback(
    (courseId: string, lessonIds: string[]): number => {
      if (lessonIds.length === 0) return 0;
      const total = lessonIds.reduce((sum, lessonId) => {
        const record = state.lessons[lessonKey(courseId, lessonId)];
        if (!record) return sum;
        return sum + (record.completed ? 100 : record.percent);
      }, 0);
      return Math.round(total / lessonIds.length);
    },
    [state.lessons]
  );

  const getResumePoint = useCallback((): AcademyResumePoint | undefined => state.lastViewed, [
    state.lastViewed,
  ]);

  const resetProgress = useCallback(() => {
    persist(() => EMPTY_STATE);
  }, [persist]);

  return {
    setLessonProgress,
    markLessonComplete,
    getLessonProgress,
    getCourseProgress,
    getResumePoint,
    resetProgress,
  };
};
