import type { ReactNode } from 'react';

import Box from '@mui/material/Box';

import { FORM_MAX_WIDTH } from './styles';

// ----------------------------------------------------------------------
// Contenedor compartido para los formularios del wizard.
// Garantiza el mismo ancho, dirección y gap entre todos los pasos.
// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export function WizardShell({ children }: Props) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: FORM_MAX_WIDTH,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      {children}
    </Box>
  );
}
