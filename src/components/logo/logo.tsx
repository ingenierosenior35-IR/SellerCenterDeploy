'use client';

import type { LinkProps } from '@mui/material/Link';

import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled, type Theme, type SxProps } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { FullLogo } from './full-logo';
import { logoClasses } from './classes';
import { SingleLogo } from './single-logo';

// ----------------------------------------------------------------------

export interface LogoProps {
  sx?: SxProps<Theme>;
  disabled?: boolean;
  className?: string;
  href?: string;
  isNavMini?: boolean;
}

export function Logo({
  sx,
  disabled,
  className,
  href = '/',
  isNavMini = true,
  ...other
}: LogoProps) {

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: 40,
          height: 40,
          ...(!isNavMini && { width: 102, height: 36 }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isNavMini ? <SingleLogo /> : <FullLogo />}
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)<LinkProps>(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));


