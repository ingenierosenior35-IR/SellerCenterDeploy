'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { HomeContent } from 'src/layouts/home';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductUploadDialog } from 'src/sections/product/components/product-upload-dialog/product-upload-dialog';

// export const metadata = { title: `Bulk upload - ${CONFIG.appName}` };

export default function LoadOptionsView() {
  const [openBulk, setOpenBulk] = useState(false);
  return (
    <HomeContent>
      {' '}
      <CustomBreadcrumbs
        heading="Bulk loading"
        links={[
          { name: 'Home', href: paths.home.root },
          { name: 'Product', href: paths.product.root },
          { name: 'Load', href: paths.product.load },
          { name: 'Bulk Loading' },
        ]}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Button to open bulk upload modal */}
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => setOpenBulk(true)}
            >
              Upload files
            </Button>

            {/* Existing refresh button */}
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:eye-bold" />}
            //   onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Box>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ProductUploadDialog open={openBulk} onClose={() => setOpenBulk(false)} />

    </HomeContent>
  );
}
