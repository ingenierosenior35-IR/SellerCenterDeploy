'use client';

import Box from '@mui/material/Box';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: '#111111',
        color: 'common.white',
        width: '100%',
      }}
    >
      {children}
    </Box>
  );
}
