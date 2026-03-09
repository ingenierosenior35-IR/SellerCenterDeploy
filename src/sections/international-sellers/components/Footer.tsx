'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Footer() {
  const maxContentWidth = 900;

  return (
    <Box component="footer" sx={{ width: '100%', bgcolor: '#222', color: 'grey.100', pt: 2, pb: 6 }}>
      <Box sx={{ width: '100%', maxWidth: `${maxContentWidth}px`, mx: 'auto', px: { xs: 3, sm: 4, md: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: { xs: 0, md: 1 } }}>
          <Box sx={{ width: { xs: '48%', sm: '40%', md: '32%' }, maxWidth: 360, borderTop: '1px solid rgba(255,255,255,0.06)' }} />
        </Box>

        <Grid
          container
          columnSpacing={{ xs: 2, sm: 4, md: 16 }}
          rowSpacing={{ xs: 3, md: 0 }}
          justifyContent="center"
          alignItems="flex-start"
          sx={{ mt: 4 }}
        >
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4
            }}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 320, alignItems: 'center', textAlign: 'center' }}>
              <Box component="img" src="/assets/images/logo/miti-miti.svg" alt="MITI‑MITI" sx={{ height: { xs: 20, sm: 24, md: 36 }, width: 'auto' }} />


            </Box>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4
            }}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 320, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography sx={{ fontWeight: 700, color: 'grey.100' }}>Address</Typography>
              <Typography sx={{ color: 'grey.400', fontSize: 14, lineHeight: 1.6 }}>
                Address: 27 Division St,
                <br />
                NY 10002 USA
              </Typography>
            </Box>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4
            }}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 320, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography sx={{ fontWeight: 700, color: 'grey.100' }}>Contact us</Typography>
              <Typography sx={{ color: 'grey.400', fontSize: 14, lineHeight: 1.6 }}>
                +1 80 7845 78963
                <br />
                info@example.com
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', mt: { xs: 4, md: 6 }, mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
          <Link href="/terms" underline="none" sx={{ color: 'grey.400', fontSize: 13 }}>
            Términos y condiciones
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
