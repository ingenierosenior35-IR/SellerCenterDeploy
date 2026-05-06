import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  current: number;
  total: number;
  onBack?: () => void;
};

export function StepIndicator({ current, total, onBack }: Props) {
  const { translate } = useTranslate();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
      {onBack ? (
        <IconButton
          type="button"
          onClick={onBack}
          aria-label={translate('createSellers.common.back')}
          sx={{ ml: -1, color: 'common.white' }}
        >
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>
      ) : (
        <Box sx={{ width: 40, flexShrink: 0 }} />
      )}

      <Box sx={{ display: 'flex', gap: 0.75, flex: 1 }}>
        {Array.from({ length: total }, (_, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              height: 4,
              borderRadius: 999,
              bgcolor: index < current ? 'common.white' : 'rgba(255, 255, 255, 0.2)',
              transition: (theme) => theme.transitions.create('background-color'),
            }}
          />
        ))}
      </Box>

      <Typography
        variant="caption"
        sx={{ color: 'rgba(255, 255, 255, 0.7)', minWidth: 64, textAlign: 'right' }}
      >
        {translate('createSellers.common.step')} {current} {translate('createSellers.common.of')} {total}
      </Typography>
    </Box>
  );
}
