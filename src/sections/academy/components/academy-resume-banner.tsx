import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales/langs/i18n';

import { Iconify } from 'src/components/iconify';

import { findCourseById, ACADEMY_COURSES, findLessonInCourse } from '../data/courses';

// ----------------------------------------------------------------------

interface AcademyResumeBannerProps {
  resumePoint?: { courseId: string; lessonId: string };
}

export function AcademyResumeBanner({ resumePoint }: Readonly<AcademyResumeBannerProps>) {
  const router = useRouter();
  const { translate } = useTranslate();

  if (!resumePoint) return null;

  const course = findCourseById(resumePoint.courseId);
  if (!course) return null;

  const lessonHit = findLessonInCourse(course, resumePoint.lessonId);
  if (!lessonHit) return null;

  const handleResume = () => {
    router.push(paths.academy.lesson(resumePoint.courseId, resumePoint.lessonId));
  };

  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        mb: 3,
        borderRadius: 2,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.vars?.palette.primary.main ?? theme.palette.primary.main} 0%, ${theme.vars?.palette.primary.dark ?? theme.palette.primary.dark} 100%)`,
        color: 'common.white',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Iconify icon="solar:play-circle-bold" width={28} />
          </Box>
          <Stack sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
              {translate('academyModule.resume.eyebrow')}
            </Typography>
            <Typography variant="h6" sx={{ lineHeight: 1.3 }} noWrap>
              {lessonHit.lesson.title}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              {translate(course.titleKey)}
            </Typography>
          </Stack>
        </Stack>

        <Button
          variant="contained"
          color="inherit"
          onClick={handleResume}
          startIcon={<Iconify icon="carbon:play" />}
          sx={{
            color: 'primary.main',
            bgcolor: 'common.white',
            '&:hover': { bgcolor: 'grey.100' },
            flexShrink: 0,
          }}
        >
          {translate('academyModule.resume.cta')}
        </Button>
      </Stack>
    </Box>
  );
}

// Re-export para tests / consumidores que deseen iterar el catálogo completo.
export { ACADEMY_COURSES };
