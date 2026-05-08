'use client';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useSellerStatus } from 'src/hooks/seller/use-seller-status';
import { useAcademyProgress } from 'src/hooks/academy/use-academy-progress';

import { HomeContent } from 'src/layouts/home';
import { useTranslate } from 'src/locales/langs/i18n';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ACADEMY_COURSES } from '../data/courses';
import { AcademyCourseCard } from '../components/academy-course-card';
import { AcademyResumeBanner } from '../components/academy-resume-banner';

// ----------------------------------------------------------------------

export function AcademyListView() {
  const { translate } = useTranslate();
  const { status } = useSellerStatus();
  const { getCourseProgress, getResumePoint } = useAcademyProgress();

  // Filtra cursos según el estado de vinculación. Un curso sin
  // `visibleForStatuses` siempre se muestra; uno con la prop solo se muestra
  // si el estado actual está incluido. Esto cubre el AC#3: contenido extra
  // para sellers aprobados.
  const visibleCourses = useMemo(
    () =>
      ACADEMY_COURSES.filter(
        (course) => !course.visibleForStatuses || course.visibleForStatuses.includes(status)
      ),
    [status]
  );

  const resumePoint = getResumePoint();

  return (
    <HomeContent>
      <CustomBreadcrumbs
        heading={translate('academyModule.title')}
        links={[
          { name: translate('sidebarMenu.home.title'), href: paths.home.root },
          { name: translate('academyModule.title') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AcademyResumeBanner resumePoint={resumePoint} />

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
        <Iconify icon="solar:notebook-bold-duotone" width={28} sx={{ color: 'primary.main' }} />
        <Typography variant="h6">{translate('academyModule.list.heading')}</Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
        }}
      >
        {visibleCourses.map((course) => (
          <AcademyCourseCard
            key={course.id}
            course={course}
            progress={getCourseProgress(
              course.id,
              course.lessons.map((lesson) => lesson.id)
            )}
          />
        ))}
      </Box>
    </HomeContent>
  );
}
