'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAcademyProgress } from 'src/hooks/academy/use-academy-progress';

import { HomeContent } from 'src/layouts/home';
import { useTranslate } from 'src/locales/langs/i18n';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { findCourseById } from '../data/courses';
import { AcademyLessonItem } from '../components/academy-lesson-item';
import { AcademyVideoPlayer } from '../components/academy-video-player';

// ----------------------------------------------------------------------

interface AcademyCourseViewProps {
  courseId: string;
  /** Si está presente, se selecciona esa lección al entrar (deep-link). */
  initialLessonId?: string;
}

export function AcademyCourseView({ courseId, initialLessonId }: Readonly<AcademyCourseViewProps>) {
  const router = useRouter();
  const { translate } = useTranslate();
  const {
    setLessonProgress,
    markLessonComplete,
    getLessonProgress,
    getCourseProgress,
    getResumePoint,
  } = useAcademyProgress();

  const course = useMemo(() => findCourseById(courseId), [courseId]);

  // Selección inicial: deep-link > último visto del mismo curso > primera lección.
  const [activeLessonId, setActiveLessonId] = useState<string | undefined>(() => {
    if (initialLessonId) return initialLessonId;
    return undefined;
  });

  useEffect(() => {
    if (!course) return;
    if (activeLessonId) return;

    const resume = getResumePoint();
    if (resume?.courseId === course.id) {
      const exists = course.lessons.some((lesson) => lesson.id === resume.lessonId);
      if (exists) {
        setActiveLessonId(resume.lessonId);
        return;
      }
    }
    setActiveLessonId(course.lessons[0]?.id);
  }, [course, activeLessonId, getResumePoint]);

  const activeLesson = useMemo(
    () => course?.lessons.find((lesson) => lesson.id === activeLessonId),
    [course, activeLessonId]
  );

  const handleProgress = useCallback(
    (percent: number) => {
      if (!course || !activeLesson) return;
      setLessonProgress(course.id, activeLesson.id, percent);
    },
    [course, activeLesson, setLessonProgress]
  );

  const handleComplete = useCallback(() => {
    if (!course || !activeLesson) return;
    markLessonComplete(course.id, activeLesson.id);
  }, [course, activeLesson, markLessonComplete]);

  const handleManualComplete = () => {
    if (!course || !activeLesson) return;
    markLessonComplete(course.id, activeLesson.id);

    const currentIndex = course.lessons.findIndex((lesson) => lesson.id === activeLesson.id);
    const nextLesson = course.lessons[currentIndex + 1];
    if (nextLesson) {
      setActiveLessonId(nextLesson.id);
    }
  };

  if (!course) {
    return (
      <HomeContent>
        <EmptyContent
          title={translate('academyModule.notFound.title')}
          description={translate('academyModule.notFound.description')}
          action={
            <Button
              variant="contained"
              onClick={() => router.push(paths.academy.root)}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            >
              {translate('academyModule.notFound.backToList')}
            </Button>
          }
        />
      </HomeContent>
    );
  }

  const courseProgress = getCourseProgress(
    course.id,
    course.lessons.map((lesson) => lesson.id)
  );

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading={translate(course.titleKey)}
        links={[
          { name: translate('sidebarMenu.home.title'), href: paths.home.root },
          { name: translate('academyModule.title'), href: paths.academy.root },
          { name: translate(course.titleKey) },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 2fr) minmax(280px, 1fr)' },
        }}
      >
        <Stack spacing={3} sx={{ minWidth: 0 }}>
          {activeLesson ? (
            <>
              <AcademyVideoPlayer
                key={activeLesson.id}
                videoUrl={activeLesson.videoUrl}
                title={activeLesson.title}
                onProgress={handleProgress}
                onComplete={handleComplete}
              />
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {activeLesson.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {activeLesson.description}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Iconify icon="solar:check-circle-bold" />}
                  onClick={handleManualComplete}
                >
                  {translate('academyModule.lesson.markComplete')}
                </Button>
              </Stack>
            </>
          ) : (
            <EmptyContent title={translate('academyModule.lesson.empty')} />
          )}
        </Stack>

        <Card sx={{ p: 2, height: 'fit-content', position: { md: 'sticky' }, top: { md: 88 } }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2">
                {translate('academyModule.course.progressLabel')}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={courseProgress}
                  sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {courseProgress}%
                </Typography>
              </Stack>
            </Box>
            <Divider />
            <Typography variant="subtitle2">
              {translate('academyModule.course.lessonsLabel')}
            </Typography>
            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {course.lessons.map((lesson, index) => (
                <AcademyLessonItem
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  active={lesson.id === activeLessonId}
                  progress={getLessonProgress(course.id, lesson.id)}
                  onSelect={() => setActiveLessonId(lesson.id)}
                />
              ))}
            </List>
          </Stack>
        </Card>
      </Box>
    </HomeContent>
  );
}
