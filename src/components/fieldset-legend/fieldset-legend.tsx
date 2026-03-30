'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { ReactNode, ComponentPropsWithoutRef } from 'react';

import Typography from '@mui/material/Typography';

export type FieldsetLegendProps = Omit<
  ComponentPropsWithoutRef<typeof Typography>,
  'children' | 'component'
> & {
  children: ReactNode;
  sx?: SxProps<Theme>;
};

const defaultLegendSx: SxProps<Theme> = {
  px: 1,
  py: 0.5,
  borderRadius: 2,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
  color: 'text.secondary',
  fontWeight: 'bold',
  fontSize: '0.75rem',
};

export function FieldsetLegend({ children, sx, ...other }: FieldsetLegendProps) {
  return (
    <Typography
      component="legend"
      sx={[defaultLegendSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      {...other}
    >
      {children}
    </Typography>
  );
}
