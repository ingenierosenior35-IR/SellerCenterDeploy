import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type FormHeadProps = BoxProps & {
  icon?: React.ReactNode;
  title: React.ReactNode;
};

export function FormHead({ sx, icon, title, ...other }: FormHeadProps) {
  return (
    <>
      {icon && (
        <Box component="span" sx={{ mb: 3, mx: 'auto', display: 'inline-flex' }}>
          {icon}
        </Box>
      )}

      <Box
        sx={[
          () => ({
            mb: 5,
            gap: 1.5,
            display: 'flex',
            textAlign: 'center',
            whiteSpace: 'pre-line',
            flexDirection: 'column',
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Typography variant="h4" sx={{ mt: 1, textAlign: 'center', fontWeight: 800, letterSpacing: '-0.2px' }}>
          {title}
        </Typography>
      </Box>
    </>
  );
}
