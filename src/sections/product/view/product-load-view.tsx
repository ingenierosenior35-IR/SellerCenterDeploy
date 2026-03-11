'use client';

import Card from '@mui/material/Card';
import { paths } from 'src/routes/paths';
import Button from '@mui/material/Button';
import { RouterLink } from 'src/routes/components';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import List from '@mui/material/List';
import { Fragment } from 'react/jsx-runtime';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Iconify } from 'src/components/iconify';

export function ProductLoadView() {
  const cardSx = (theme: any) => ({
    p: 3,
    borderRadius: 2,
    border: `1px solid ${theme.vars?.palette?.divider || theme.palette.divider}`,
    bgcolor: 'background.paper',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  });
  const renderBullets = (items: string[]) => (
    <List dense disablePadding>
      {items.map((text, idx) => (
        <Fragment key={idx}>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText
              primaryTypographyProps={{ variant: 'body2', sx: { color: 'text.secondary' } }}
              primary={text}
            />
          </ListItem>
          {idx < items.length - 1 && <Divider component="li" />}
        </Fragment>
      ))}
    </List>
  );
  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Load products"
        links={[
          { name: 'Home', href: paths.home.root },
          { name: 'Product', href: paths.product.root },
          { name: 'Load' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        <Card sx={cardSx}>
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <Typography variant="h6">Carga Masiva</Typography>
            <Divider />
            {renderBullets([
              'Ahorra tiempo cargando múltiples productos a la vez.',
              'Sincroniza tu cuenta con archivos e integraciones externas.',
              'Sincroniza tu cuenta con archivos e integraciones externas',
              'Gestiona grandes volúmenes de productos.',
            ])}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              component={RouterLink}
              href={paths.product.uploadList}
              startIcon={<Iconify icon="solar:copy-bold" />}
              variant="contained"
            >
              Carga de archivos
            </Button>
          </Stack>
        </Card>
      </Box>
    </DashboardContent>
  );
}
