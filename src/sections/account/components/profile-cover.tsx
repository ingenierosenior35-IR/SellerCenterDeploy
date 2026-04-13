'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Box, { type BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

type ProfileCoverProps = BoxProps & {
  name?: string;
  role?: string;
  coverUrl?: string;
  avatarUrl?: string;
  sx?: SxProps<Theme>;
};

export function ProfileCover({
  sx,
  name,
  role,
  coverUrl,
  avatarUrl,
  ...other
}: ProfileCoverProps) {
  return (
    <Box
      sx={[
        (theme: Theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(0deg, ${varAlpha(
                theme.vars.palette.primary.darkerChannel,
                0.8
              )}, ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.8)})`,
              `url(${coverUrl})`,
            ],
          }),
          height: 1,
          color: 'common.white',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          display: 'flex',
          left: { md: 24 },
          bottom: { md: 24 },
          zIndex: { md: 10 },
          pt: { xs: 6, md: 0 },
          position: { md: 'absolute' },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Avatar
          alt={name}
          src={avatarUrl}
          sx={(theme: Theme) => ({
            mx: 'auto',
            width: { xs: 64, md: 128 },
            height: { xs: 64, md: 128 },
            border: `solid 2px ${theme.vars.palette.common.white}`,
          })}
        >
          {name?.charAt(0).toUpperCase()}
        </Avatar>

        <ListItemText
          primary={name}
          secondary={role}
          slotProps={{
            primary: { sx: { typography: 'h4' } },
            secondary: {
              sx: { mt: 0.5, opacity: 0.48, color: 'inherit' },
            },
          }}
          sx={{ mt: 3, ml: { md: 3 }, textAlign: { xs: 'center', md: 'unset' } }}
        />
      </Box>
    </Box>
  );
}
