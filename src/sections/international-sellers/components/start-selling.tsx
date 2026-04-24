'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function StartSelling() {
  const contentMaxWidth = 620;

  return (
    <Grid
      container
      spacing={4}
      alignItems="center"
      sx={{ justifyContent: { xs: 'center', sm: 'center', md: 'center', lg: 'flex-start' } }}
    >
      <Grid
        size={{
          xs: 12,
          md: 6
        }}
        sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'center', md: 'center', lg: 'flex-start' } }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: `${contentMaxWidth}px`,
            mx: { xs: 'auto', sm: 'auto', md: 'auto', lg: 0 },
            pr: { xs: 0, sm: 0, md: 0, lg: 30 },
            px: { xs: 2, md: 0 },
            boxSizing: 'border-box',
            py: { xs: 2, md: 6 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'center', sm: 'center', md: 'center', lg: 'flex-start' },
            textAlign: { xs: 'center', sm: 'center', md: 'center', lg: 'left' },
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.01em',
              fontSize: { xs: '1.8rem', sm: '1.8rem', md: '1.8rem', lg: '1.75rem' },
              lineHeight: 1.2,
              width: '100%',
              textAlign: { xs: 'center', sm: 'center', md: 'center', lg: 'left' },
              mx: { xs: 'auto', sm: 'auto', md: 'auto', lg: 0 },
            }}
          >
            START SELLING
            <br />
            WITH MITI‑MITI®
          </Typography>
        </Box>
      </Grid>

      <Grid
        size={{
          xs: 12,
          md: 6
        }}
        sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'center', md: 'center', lg: 'flex-end' } }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: `${contentMaxWidth}px`,
            mx: { xs: 'auto', sm: 'auto', md: 'auto', lg: 0 },
            px: { xs: 2, md: 0 },
            boxSizing: 'border-box',
            py: { xs: 1.5, md: 6 },
          }}
        >
          <Box
            component="img"
            src="/assets/images/international/division.svg"
            alt="division"
            sx={{
              display: 'block',
              width: { xs: 120, sm: 160, md: 160, lg: 260 },
              height: 'auto',
              mb: { xs: 1.5, md: 5 },
              mx: 'auto',
            }}
          />

          <Box sx={{ textAlign: { xs: 'center', sm: 'center', md: 'center', lg: 'left' } }}>
            <Typography
              variant="body1"
              color="grey.00"
              sx={{
                lineHeight: 1.8,
                mb: 1.5,
                fontSize: { xs: '1rem', sm: '1rem', md: '1rem', lg: '0.95rem' },
              }}
            >
              MITI‑MITI® is an intelligent cross‑border marketplace designed to connect verified suppliers in Mainland China with end customers in Colombia, through a simple, secure, and fully managed operational model.
            </Typography>

            <Typography
              variant="body1"
              color="grey.300"
              sx={{
                lineHeight: 1.8,
                mb: 1.5,
                fontSize: { xs: '1rem', sm: '1rem', md: '1rem', lg: '0.95rem' },
              }}
            >
              We remove the complexity of international trade so you can focus on manufacturing and supplying competitive products.
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
