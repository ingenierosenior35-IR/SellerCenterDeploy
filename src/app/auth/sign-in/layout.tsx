import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'common.black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          position: 'relative',
        }}
      >
        <Box
          component="a"
          href="/"
          aria-label="Miti Miti"
          sx={{
            position: 'absolute',
            top: { xs: 12, md: 20 },
            left: { xs: 12, md: 20 },
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            zIndex: 1500,
          }}
        >
          <Box
            component="img"
            src="/assets/images/logo/logo-miti.svg"
            alt="Miti Miti"
            sx={{
              width: { xs: 100, md: 120 },
              height: 'auto',
              display: 'block',
            }}
          />
        </Box>

        <Paper
          elevation={1}
          sx={{
            width: '100%',
            maxWidth: 520,
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          {children}
        </Paper>
      </Box>
    </GuestGuard>
  );
}
