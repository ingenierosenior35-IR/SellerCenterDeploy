import type { AcademyCourse } from '../types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CardActionArea from '@mui/material/CardActionArea';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales/langs/i18n';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface AcademyCourseCardProps {
  course: AcademyCourse;
  progress: number;
}

const LEVEL_COLOR: Record<AcademyCourse['level'], 'info' | 'warning' | 'error'> = {
  beginner: 'info',
  intermediate: 'warning',
  advanced: 'error',
};

export function AcademyCourseCard({ course, progress }: Readonly<AcademyCourseCardProps>) {
  const router = useRouter();
  const { translate } = useTranslate();

  const totalMinutes = course.lessons.reduce((sum, lesson) => sum + lesson.durationMinutes, 0);

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
      }}
    >
      <CardActionArea
        onClick={() => router.push(paths.academy.course(course.id))}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box
          sx={{
            position: 'relative',
            height: 160,
            bgcolor: 'background.neutral',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Iconify icon="solar:play-circle-bold" width={56} sx={{ color: 'primary.main' }} />
          <Label
            variant="filled"
            color={LEVEL_COLOR[course.level]}
            sx={{ position: 'absolute', top: 12, right: 12, textTransform: 'capitalize' }}
          >
            {translate(`academyModule.levels.${course.level}`)}
          </Label>
        </Box>

        <Stack spacing={1.5} sx={{ p: 2.5, flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ lineHeight: 1.3 }}>
            {translate(course.titleKey)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', flexGrow: 1, lineHeight: 1.5 }}
          >
            {translate(course.descriptionKey)}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ color: 'text.secondary' }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Iconify icon="solar:videocamera-record-bold" width={16} />
              <Typography variant="caption">
                {course.lessons.length} {translate('academyModule.card.lessons')}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Iconify icon="solar:clock-circle-bold" width={16} />
              <Typography variant="caption">
                {totalMinutes} {translate('academyModule.card.minutes')}
              </Typography>
            </Stack>
          </Stack>

          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 0.5 }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {translate('academyModule.card.progress')}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {progress}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 6, borderRadius: 1 }}
            />
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
