'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { ProductUploadDialog } from 'src/sections/product/components/product-upload-dialog/product-upload-dialog';
import { paths } from 'src/routes/paths';

export default function ProductLoadListPage() {
  const [openBulk, setOpenBulk] = useState(false); // <-- modal state here
//   const handleRefresh = async () => {
//     await fetchJobs();
//     toast.success('Cargas actualizadas');
//   };
  return (
    <DashboardContent>
      {' '}
      <CustomBreadcrumbs
        heading="Load products"
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
              Carga de archivos
            </Button>

            {/* Existing refresh button */}
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:eye-bold" />}
            //   onClick={handleRefresh}
            >
              Refrescar
            </Button>
          </Box>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <ProductUploadDialog open={openBulk} onClose={() => setOpenBulk(false)} />

    </DashboardContent>
  );
}
