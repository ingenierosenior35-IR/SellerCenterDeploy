import type { IUserProfile } from 'src/interfaces';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { getInitials } from 'src/utils';
import { CONFIG } from 'src/global-config';

import { AnimateBorder } from 'src/components/animate';

import { SvgColor } from '../svg-color';

interface Props {
  user: IUserProfile;
  onSettingsClick?: () => void;
}

export const StoreIdentity = ({
  user,
  onSettingsClick,
}: Props) => {

  const renderAvatar = () => (
    <AnimateBorder
      sx={{
        p: '6px',
        width: 50,
        height: 50,
        borderRadius: '50%',
      }}
      slotProps={{
        primaryBorder: { size: 120, sx: { color: 'primary.main' } },
      }}
    >
      <Avatar
        alt={user?.displayName}
        sx={{ width: 1, height: 1 }}
      >
        {getInitials(user)}
      </Avatar>
    </AnimateBorder>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        borderRadius: 2,
        backgroundColor: (theme) =>
          alpha(theme.palette.common.white, 0.04),
      }}
      width="90%"
    >
      {renderAvatar()}

      {/* Info tienda */}
      <Box flexGrow={1} minWidth={0}>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          noWrap
        >
          {user.displayName}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
        >
          {user.email}
        </Typography>
      </Box>

      <IconButton
        size="small"
        onClick={onSettingsClick}
        sx={{
          color: 'text.secondary',
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/ic-settings.svg`} />
      </IconButton>
    </Box>
  );
};
