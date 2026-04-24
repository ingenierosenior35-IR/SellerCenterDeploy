'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Hero from 'src/sections/international-sellers/components/hero';
import Footer from 'src/sections/international-sellers/components/footer';
import Features from 'src/sections/international-sellers/components/features';
import WhyCards from 'src/sections/international-sellers/components/why-cards';
import HowItWorks from 'src/sections/international-sellers/components/how-it-works';
import MiddlePanel from 'src/sections/international-sellers/components/middle-panel';
import StartSelling from 'src/sections/international-sellers/components/start-selling';

export const LandingView = () => (
  <Box sx={{ bgcolor: '#222', color: 'common.white', minHeight: '100vh' }}>
    <Hero />

    <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <StartSelling />
        <Features />
      </Container>
    </Box>

    <Box component="section" sx={{ py: 0 }}>
      <Container maxWidth="lg">
        <HowItWorks />
      </Container>
    </Box>

    <Box component="section" sx={{ py: { xs: 0, md: 0 } }}>
      <MiddlePanel />
    </Box>

    <Box component="section" sx={{ py: { xs: 6, md: 8 }, bgcolor: '#111' }}>
      <Container maxWidth="lg">
        <WhyCards />
      </Container>
    </Box>

    <Footer />
  </Box>
);
