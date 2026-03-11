import { Box, Typography } from '@mui/material';

export const CsvHelpTemplate = () => (
  <Box>
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      ¿No sabes cómo llenar el CSV?{' '}
      <a
        href="/home/product/product-instructions"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}
      >
        👉 Ver instructivo y descargar plantilla
      </a>
    </Typography>
  </Box>
);
