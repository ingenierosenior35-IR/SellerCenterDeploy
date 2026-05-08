import type { AcademyLesson } from '../types';
import type { AcademyLessonRecord } from 'src/hooks/academy/use-academy-progress';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { useTranslate } from 'src/locales/langs/i18n';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface AcademyLessonItemProps {
  lesson: AcademyLesson;
  index: number;
  active: boolean;
  progress: AcademyLessonRecord;
  onSelect: () => void;
}

export function AcademyLessonItem({
  lesson,
  index,
  active,
  progress,
  onSelect,
}: Readonly<AcademyLessonItemProps>) {
  const { translate } = useTranslate();

  const statusIcon = progress.completed
    ? 'solar:check-circle-bold'
    : progress.percent > 0
      ? 'solar:play-circle-bold'
      : 'solar:lock-password-outline';

  const statusColor = progress.completed
    ? 'success.main'
    : progress.percent > 0
      ? 'primary.main'
      : 'text.disabled';

  const stateLabel = progress.completed
    ? translate('academyModule.lesson.completed')
    : progress.percent > 0
      ? `${progress.percent}%`
      : translate('academyModule.lesson.notStarted');

  return (
    <ListItemButton
      selected={active}
      onClick={onSelect}
      sx={{
        borderRadius: 1.5,
        py: 1.5,
        px: 2,
        gap: 2,
        '&.Mui-selected': { bgcolor: 'action.selected' },
      }}
    >
      <Box sx={{ color: statusColor, display: 'flex' }}>
        <Iconify icon={statusIcon} width={24} />
      </Box>

      <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: active ? 600 : 500 }}>
          {index + 1}. {lesson.title}
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: 'text.secondary' }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Iconify icon="solar:clock-circle-outline" width={14} />
            <Typography variant="caption">
              {lesson.durationMinutes} {translate('academyModule.card.minutes')}
            </Typography>
          </Stack>
          <Typography variant="caption">·</Typography>
          <Typography variant="caption">{stateLabel}</Typography>
        </Stack>
      </Stack>
    </ListItemButton>
  );
}
