'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { ProductListInterface } from 'src/interfaces';

import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { HomeContent } from 'src/layouts/home';
import { useTranslate } from 'src/locales/langs/i18n';
import { useGetProducts } from 'src/actions/product/useGetProducts';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ErrorContent } from 'src/components/error-content';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useToolbarSettings, CustomGridActionsCellItem } from 'src/components/custom-data-grid';

import { PRODUCT_STOCK_OPTIONS } from 'src/sections/product/constants/product-constants';

import {
  RenderCellSku,
  RenderCellStock,
  RenderCellPrice,
  RenderCellProduct,
} from '../components/product-table-row';

// ----------------------------------------------------------------------

export function ProductListView() {
  const { translate } = useTranslate();
  const toolbarOptions = useToolbarSettings();
  const { products, isLoading, isError } = useGetProducts();
  const [tableData, setTableData] = useState<ProductListInterface[]>(products);

  useEffect(() => {
    setTableData(products);
  }, [products]);

  const handleDeleteRow = useCallback((id: number) => {
    setTableData((prev) => prev.filter((row) => row.id !== id));
    toast.success('Delete success!');
  }, []);

  const columns = useGetColumns({ onDeleteRow: handleDeleteRow, translate });

  return (
    <HomeContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading= {translate('sidebarMenu.myProducts.title')}
        links={[
          { name: translate('sidebarMenu.home.title'), href: paths.home.root },
          { name: translate('sidebarMenu.myProducts.title'), href: paths.product.root },
          { name: translate('sidebarMenu.myProducts.subtitles.list') },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.product.root}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {translate('addProduct')}
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card
        sx={{
          minHeight: 640,
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          height: { xs: 800, md: '1px' },
          flexDirection: { md: 'column' },
        }}
      >
        {isError ? (
          <ErrorContent
            title={translate('productsNotAvailable')}
            description={translate('productsLoadError')}
          />
          ) : (
            <DataGrid
              {...toolbarOptions.settings}
              rows={tableData}
              columns={columns}
              loading={isLoading}
              getRowHeight={() => 'auto'}
              pageSizeOptions={[5, 10, 20, { value: -1, label: translate('mui.common.all') }]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              slots={{
                noRowsOverlay: () => <EmptyContent />,
                noResultsOverlay: () => <EmptyContent title={translate('noResultsFound')} />,
              }}
              sx={{
                [`& .${gridClasses.cell}`]: {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
            />
          )
        }
      </Card>
    </HomeContent>
  );
}

// ----------------------------------------------------------------------

type UseGetColumnsProps = {
  onDeleteRow: (id: number) => void;
  translate: ReturnType<typeof useTranslate>['translate'];
};

const useGetColumns = ({ onDeleteRow, translate }: UseGetColumnsProps) => {
  const theme = useTheme();

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: translate('product'),
        flex: 1,
        minWidth: 300,
        hideable: false,
        renderCell: (params) => (
          <RenderCellProduct
            params={params}
            href={paths.product.details(params.row.id)}
          />
        ),
      },
      {
        field: 'sku',
        headerName: translate('sku'),
        width: 200,
        renderCell: (params) => <RenderCellSku params={params} />,
      },
      {
        field: 'inventoryType',
        headerName: translate('stock'),
        width: 160,
        type: 'singleSelect',
        filterable: false,
        valueOptions: PRODUCT_STOCK_OPTIONS,
        renderCell: (params) => <RenderCellStock params={params} />,
      },
      {
        field: 'price',
        headerName: translate('price'),
        width: 120,
        editable: true,
        renderCell: (params) => <RenderCellPrice params={params} />,
      },
      {
        type: 'actions',
        field: 'actions',
        headerName: ' ',
        width: 64,
        align: 'right',
        headerAlign: 'right',
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        getActions: (params) => [
          <CustomGridActionsCellItem
            key={`view-${params.row.id}`}
            showInMenu
            label={translate('view')}
            icon={<Iconify icon="solar:eye-bold" />}
            href={paths.product.details(params.row.id)}
          />,
          <CustomGridActionsCellItem
            key={`edit-${params.row.id}`}
            showInMenu
            label={translate('edit')}
            icon={<Iconify icon="solar:pen-bold" />}
            href={paths.product.details(params.row.id)}
          />,
          <CustomGridActionsCellItem
            key={`delete-${params.row.id}`}
            showInMenu
            label={translate('delete')}
            icon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={() => onDeleteRow(params.row.id)}
            style={{ color: theme.vars.palette.error.main }}
          />,
        ],
      },
    ],
    [onDeleteRow, theme.vars.palette.error.main, translate]
  );

  return columns;
};
