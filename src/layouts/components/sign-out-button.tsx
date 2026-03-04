import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button, { type ButtonProps } from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { useLogout } from 'src/actions/auth/useLogout';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const router = useRouter();

  const { mutateAsync } = useLogout();

  const handleLogout = async() => {
      await mutateAsync();

    // onClose?.();
    router.refresh();
  };

  return (
    <Box
      sx={[{
        px: 2,
        py: 5,
        textAlign: 'center' },
      ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Divider sx={{ my: 2, borderColor: varAlpha('divider', 0.12) }} />
      <Button
        fullWidth
        size="medium"
        onClick={handleLogout}
        sx={{
          ...sx,
          color: 'error.main',
          '&:hover': {
            backgroundColor: 'var(--nav-item-hover-bg)',
          },
          ':hover': { backgroundColor: 'var(--nav-item-hover-bg)' },
        }}
        startIcon={<Iconify icon="mdi:logout" sx={{ color: 'error.main' }} />}
        {...other}
      >
        Logout
      </Button>
    </Box>
  );
}
