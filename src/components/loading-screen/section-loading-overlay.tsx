'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { AnimateLogoZoom } from '../animate';

// ----------------------------------------------------------------------

export type SectionLoadingOverlayProps = {
  /** Activa/desactiva el overlay */
  open: boolean;
  /** Mensaje debajo del logo (ej: "Creando producto simple, por favor espere…") */
  message?: string;
  sx?: SxProps<Theme>;
};

/**
 * Overlay de carga local: cubre únicamente el contenedor padre (position: relative).
 * Muestra el logo animado del proyecto con un mensaje descriptivo debajo.
 * El logo permanece centrado en el viewport gracias a position: sticky.
 */
export function SectionLoadingOverlay({ open, message, sx }: SectionLoadingOverlayProps) {
  if (!open) return null;

  return (
    <OverlayRoot sx={sx}>
      <StickyCenter>
        <AnimateLogoZoom />

        {message && (
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.primary',
              textAlign: 'center',
              maxWidth: 320,
              fontWeight: 600,
            }}
          >
            {message}
          </Typography>
        )}
      </StickyCenter>
    </OverlayRoot>
  );
}

// ----------------------------------------------------------------------

const OverlayRoot = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  zIndex: 99,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: varAlpha(theme.vars.palette.background.defaultChannel, 0.92),
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
}));

/**
 * Contenedor sticky que mantiene el logo + mensaje siempre visible
 * en el centro vertical del viewport mientras se hace scroll.
 */
const StickyCenter = styled('div')(() => ({
  position: 'sticky',
  top: '50vh',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  alignSelf: 'center',
  gap: 24,
}));
