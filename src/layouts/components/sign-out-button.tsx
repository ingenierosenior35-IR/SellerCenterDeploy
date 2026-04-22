import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button, { type ButtonProps } from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useTranslate } from 'src/locales/langs/i18n';

import { SvgColor } from 'src/components/svg-color';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  onClose?: () => void;
  isNavMini?: boolean;
};

export function SignOutButton({ onClose, sx, isNavMini = false, ...other }: Props) {
  const { translate } = useTranslate();
  const router = useRouter();

  const { logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  if (isNavMini) {
    return (
      <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
        <Divider sx={{ mb: 2, borderColor: varAlpha('divider', 0.12), width: '100%', position: 'absolute' }} />
        <Tooltip title={translate('logout')} placement="right" arrow>
          <IconButton
            onClick={handleLogout}
            sx={{ color: 'error.main', mt: 3, '&:hover': { backgroundColor: 'var(--nav-item-hover-bg)' } }}
          >
            <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/ic-log-out.svg`} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

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
        startIcon={
          <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/ic-log-out.svg`} />
        }
        {...other}
      >
        {translate('logout')}
      </Button>
    </Box>
  );
}
