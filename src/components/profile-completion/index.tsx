import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useTranslate } from 'src/locales/langs/i18n';

interface ProfileCompletionCardProps {
  progress: number; // 0 - 100
}

export const ProfileCompletionCard = ({
  progress,
}: ProfileCompletionCardProps) => {
  const { translate } = useTranslate();
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const getColor = () => {
    if (progress < 40) return 'error';
    if (progress < 80) return 'warning';

    return 'success';
  };

  useEffect(() => {
    setAnimatedProgress(progress);
  }, [progress]);

  return (
    <Card
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        width: '90%',
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight={600}
        mb={1}
      >
        { translate('completeProfile') }
      </Typography>

      <Box display="flex" alignItems="center" gap={1}>
        <LinearProgress
          variant="determinate"
          value={animatedProgress}
          color={getColor()}
          sx={{
            flexGrow: 1,
            height: 6,
            borderRadius: 4,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
            },
          }}
        />

        <Typography
          variant="caption"
          color="text.secondary"
          minWidth={32}
          textAlign="right"
        >
          {progress}%
        </Typography>
      </Box>
    </Card>
  );
};
