'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { LangCode } from 'src/locales/langs/i18n';
import type { ProductListInterface } from 'src/interfaces';

import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { esES } from '@mui/x-data-grid/locales';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

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

import { ProductTypeSelectorDialog } from '../components/product-type-selector-dialog';
import {
  RenderCellSku,
  RenderCellStock,
  RenderCellPrice,
  RenderCellProduct,
} from '../components/product-table-row';

export function ProductListView() {
  const router = useRouter();
  const { translate } = useTranslate();

  const legnuageStored = localStorage.getItem('i18n_lang') as LangCode | null;

  const toolbarOptions = useToolbarSettings();

  const [totalCounts, setTotalCounts] = useState(0);

  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });

  const productsPerPage = useMemo(
    () => ({
      pageSize:
        paginationModel.pageSize === -1 && totalCounts > 0 ? totalCounts : paginationModel.pageSize,
      currentPage: paginationModel.pageSize === -1 ? 1 : paginationModel.page + 1,
    }),
    [paginationModel.pageSize, paginationModel.page, totalCounts]
  );

  const { products, isError, totalCount, isFetching } = useGetProducts(productsPerPage);

  const [tableData, setTableData] = useState<ProductListInterface[]>([]);

   const [openTypeSelector, setOpenTypeSelector] = useState(false);

  useEffect(() => {
    setTableData(products);
    if (totalCount !== totalCounts && totalCount > 0) {
      setTotalCounts(totalCount);
    }
  }, [products, totalCount, totalCounts]);

  const handleDeleteRow = useCallback((id: number) => {
    setTableData((prev) => prev.filter((row) => row.id !== id));
    toast.success('Delete success!');
  }, []);

  const handleSelectProductType = useCallback(
    (type: 'simple' | 'configurable') => {
      setOpenTypeSelector(false);
      if (type === 'simple') {
        router.push(paths.product.create);
      }
      if (type === 'configurable') {
        router.push(paths.product.createConfigurable);
      }
    },
    [router]
  );

  const columns = useGetColumns({ onDeleteRow: handleDeleteRow, translate });

  return (
    <HomeContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading={translate('sidebarMenu.myProducts.title')}
        links={[
          { name: translate('sidebarMenu.home.title'), href: paths.home.root },
          { name: translate('sidebarMenu.myProducts.title'), href: paths.product.root },
          { name: translate('sidebarMenu.myProducts.subtitles.list') },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setOpenTypeSelector(true)}
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
            {...(legnuageStored === 'es'
              ? { localeText: esES.components.MuiDataGrid.defaultProps.localeText }
              : {})}
            rows={tableData}
            columns={columns}
            loading={isFetching}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 20, { value: -1, label: translate('mui.common.all') }]}
            pagination
            paginationMode="server"
            rowCount={totalCount}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
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
        )}
      </Card>

      <ProductTypeSelectorDialog
        open={openTypeSelector}
        onClose={() => setOpenTypeSelector(false)}
        onSelect={handleSelectProductType}
      />
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
          <RenderCellProduct params={params} href={paths.product.details(params.row.id)} />
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
