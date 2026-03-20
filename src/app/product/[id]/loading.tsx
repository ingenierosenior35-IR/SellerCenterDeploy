'use client';

import { CircularProgress } from '@mui/material';

import { HomeLayout } from 'src/layouts/home';

export default function Loading() {
  return (
    <HomeLayout sx={{ pt: 5, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </HomeLayout>
  );
}
