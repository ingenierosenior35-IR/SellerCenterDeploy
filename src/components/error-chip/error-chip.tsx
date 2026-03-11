import Chip from '@mui/material/Chip';

import { Iconify } from 'src/components/iconify';

interface ErrorChipProps {
  count: number;
  onClick: () => void;
  ariaLabel?: string;
}

export const ErrorChip = ({ count, onClick, ariaLabel = '' }: ErrorChipProps) => (
    <Chip
      aria-label={ariaLabel}
      clickable
      color="error"
      icon={ <Iconify icon="solar:eye-bold" />}
      label={`${count} error${count > 1 ? 'es' : ''}`}
      onClick={onClick}
      size="small"
    />
  )

