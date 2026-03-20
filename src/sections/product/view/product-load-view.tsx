'use client';

import { Fragment } from 'react/jsx-runtime';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { HomeContent } from 'src/layouts/home';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

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
    <HomeContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
            <Typography variant="h6">Bulk loading</Typography>
            <Divider />
            {renderBullets([
              'Save time by loading multiple products at once.',
              'Sync your account with external files and integrations.',
              'Sync your account with external files and integrations',
              'Manage large volumes of products.',
            ])}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              component={RouterLink}
              href={paths.product.uploadList}
              startIcon={<Iconify icon="solar:copy-bold" />}
              variant="contained"
            >
              Upload files
            </Button>
          </Stack>
        </Card>
      </Box>
    </HomeContent>
  );
}
