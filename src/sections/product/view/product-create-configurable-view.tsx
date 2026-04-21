'use client';

import type { ImagePreview } from '../components/product-image-upload';
import type { SelectedMagentoAttr } from 'src/hooks/product/use-configurable-product-payload';
import type {
  ConfigurableChildInput,
  MagentoConfigurableAttribute,
} from 'src/interfaces';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useForm, Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Radio from '@mui/material/Radio';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useConfigurableProductPayload } from 'src/hooks/product';

import { useTranslate } from 'src/locales';
import { HomeContent } from 'src/layouts/home';
import { useCategories } from 'src/actions/category/use-categories';
import { useAttributesList } from 'src/actions/product/use-attributes-list';
import { useCreateConfigurableProduct } from 'src/actions/product/use-create-configurable-product';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { SectionLoadingOverlay } from 'src/components/loading-screen';

import { ProductImageUpload } from '../components/product-image-upload';
import { CategoryTreeSelect } from '../components/category-tree-select';

// ----------------------------------------------------------------------

/** Traduce claves de error lanzadas por las acciones. */
function translateError(
  error: Error,
  translate: (ns: string, key: string) => string
): string {
  const key = error?.message;
  if (!key) return translate('configurableCreate', 'errorMessage');
  const translated = translate('configurableCreate', key);
  return translated !== key ? translated : translate('configurableCreate', 'errorMessage');
}

// ----------------------------------------------------------------------

const defaultValues = {
  name: '',
  sku: '',
  categoryId: '',
  price: 0,
  weight: 0,
  shortDescription: '',
  description: '',
};

// ----------------------------------------------------------------------

/** Agrega separadores de miles con punto (ej: "8800000" → "8.800.000") */
function formatThousands(digits: string): string {
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Campo de precio en pesos colombianos.
 */
function PriceField({ label }: { label: string }) {
  const { control } = useFormContext();
  const [display, setDisplay] = useState('0');

  return (
    <Controller
      name="price"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          fullWidth
          label={label}
          value={display}
          onFocus={() => {
            if (display === '0') setDisplay('');
          }}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '');
            setDisplay(formatThousands(digits));
            field.onChange(digits === '' ? '' : digits);
          }}
          onBlur={() => {
            if (!display) {
              setDisplay('0');
              field.onChange(0);
            }
            field.onBlur();
          }}
          error={!!error}
          helperText={error?.message}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            },
          }}
        />
      )}
    />
  );
}

/**
 * Campo de peso en kilogramos.
 */
function WeightField({ label }: { label: string }) {
  const { control } = useFormContext();
  const [display, setDisplay] = useState('0');

  return (
    <Controller
      name="weight"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          fullWidth
          label={label}
          value={display}
          onFocus={() => {
            if (display === '0') setDisplay('');
          }}
          onChange={(e) => {
            let val = e.target.value.replace(/[^\d.]/g, '');
            const dotIdx = val.indexOf('.');
            if (dotIdx !== -1) {
              val = val.slice(0, dotIdx + 1) + val.slice(dotIdx + 1).replace(/\./g, '');
            }
            if (val === '.') val = '';
            setDisplay(val);
            field.onChange(val);
          }}
          onBlur={() => {
            let val = display;
            if (val.endsWith('.')) val = val.slice(0, -1);
            if (!val) {
              setDisplay('0');
              field.onChange(0);
            } else {
              setDisplay(val);
              field.onChange(val);
            }
            field.onBlur();
          }}
          error={!!error}
          helperText={error?.message}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            },
          }}
        />
      )}
    />
  );
}

// ----------------------------------------------------------------------

/** Modo de configuración masiva para imágenes, precios o cantidades */
type BulkMode = 'single' | 'byAttribute' | 'skip';

/**
 * Campo de precio reutilizable con formato de miles (separador punto).
 * No depende de react-hook-form → puede usarse en cualquier contexto.
 */
function FormattedPriceInput({
  value,
  onChange,
  label,
  size = 'small',
  fullWidth,
  showTooltip,
}: {
  value: number;
  onChange: (val: number) => void;
  label?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  showTooltip?: boolean;
}) {
  const [display, setDisplay] = useState(value ? formatThousands(String(value)) : '0');

  useEffect(() => {
    setDisplay(value ? formatThousands(String(value)) : '0');
  }, [value]);

  return (
    <TextField
      size={size}
      fullWidth={fullWidth}
      label={label}
      value={display}
      onFocus={() => {
        if (display === '0') setDisplay('');
      }}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, '');
        setDisplay(formatThousands(digits));
        onChange(digits === '' ? 0 : Number(digits));
      }}
      onBlur={() => {
        if (!display) {
          setDisplay('0');
          onChange(0);
        }
      }}
      slotProps={{
        inputLabel: { shrink: true },
        input: {
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          ...(showTooltip && { title: `$ ${display}` }),
        },
      }}
    />
  );
}

// ----------------------------------------------------------------------

const ATTRIBUTE_SET_ID = 4;

// ----------------------------------------------------------------------

/**
 * Genera todas las combinaciones posibles entre los valores seleccionados
 * de cada atributo. Clave = attribute code, valor = option value (ID).
 */
function generateCombinations(
  selectedAttrs: SelectedMagentoAttr[]
): Record<string, string>[] {
  const validAttrs = selectedAttrs.filter((a) => a.selectedValues.length > 0);
  if (validAttrs.length === 0) return [];

  const result: Record<string, string>[] = [];

  function recurse(index: number, current: Record<string, string>) {
    if (index === validAttrs.length) {
      result.push({ ...current });
      return;
    }
    const sa = validAttrs[index];
    for (const valId of sa.selectedValues) {
      current[sa.attribute.code] = valId;
      recurse(index + 1, current);
    }
  }

  recurse(0, {});
  return result;
}

// ----------------------------------------------------------------------

/**
 * Vista del formulario para crear un producto configurable.
 *
 * Formulario continuo con dos secciones visualmente diferenciadas:
 * - Sección 1: Datos del producto base (padre configurable)
 * - Sección 2: Configuración de atributos y variaciones (hijos)
 *
 * Todo se envía al backend en UNA sola llamada (padre + hijos juntos).
 */
export function ProductCreateConfigurableView() {
  const router = useRouter();
  const { translate } = useTranslate();
  const [images, setImages] = useState<ImagePreview[]>([]);

  // Estado de atributos configurables seleccionados
  const [selectedAttributes, setSelectedAttributes] = useState<SelectedMagentoAttr[]>([]);

  // Estado de variaciones (hijos)
  const [children, setChildren] = useState<ConfigurableChildInput[]>([]);

  // ===== CONFIGURACIÓN MASIVA DE VARIACIONES =====
  const [imageMode, setImageMode] = useState<BulkMode>('skip');
  const [bulkImages, setBulkImages] = useState<ImagePreview[]>([]);
  const [imageAttr, setImageAttr] = useState<string>('');
  const [imagesByValue, setImagesByValue] = useState<Record<string, ImagePreview[]>>({});

  const [priceMode, setPriceMode] = useState<BulkMode>('skip');
  const [bulkPrice, setBulkPrice] = useState<number>(0);
  const [priceAttr, setPriceAttr] = useState<string>('');
  const [pricesByValue, setPricesByValue] = useState<Record<string, number>>({});

  const [qtyMode, setQtyMode] = useState<BulkMode>('skip');
  const [bulkQty, setBulkQty] = useState<number>(0);
  const [qtyAttr, setQtyAttr] = useState<string>('');
  const [qtiesByValue, setQtiesByValue] = useState<Record<string, number>>({});

  // Modo de configuración: masiva o manual
  const [configMode, setConfigMode] = useState<'bulk' | 'manual'>('bulk');

  const { categoryTree, categoriesLoading } = useCategories();
  const { attributes: magentoAttributes, attributesLoading } = useAttributesList();
  const { buildPayload } = useConfigurableProductPayload();

  // ===== ESQUEMA ZOD =====
  const FormSchema = z.object({
    name: z.string().min(1, translate('productCreate', 'validation.nameRequired')),
    sku: z.string().min(1, translate('productCreate', 'validation.skuRequired')),
    categoryId: z.string().min(1, translate('productCreate', 'validation.categoryRequired')),
    price: z.coerce.number().positive(translate('productCreate', 'validation.pricePositive')),
    weight: z.coerce.number().positive(translate('productCreate', 'validation.weightPositive')),
    shortDescription: z
      .string()
      .min(1, translate('productCreate', 'validation.shortDescRequired')),
    description: z.string().min(1, translate('productCreate', 'validation.descRequired')),
  });

  // ===== MUTATION =====
  const { mutateAsync: createConfigurable, isPending } = useCreateConfigurableProduct({
    onSuccess: () => {
      toast.success(translate('configurableCreate', 'successMessage'));
      router.push(paths.product.root);
    },
    onError: (error) => {
      toast.error(translateError(error, translate));
    },
  });

  // ===== FORM =====
  const methods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const { handleSubmit, watch } = methods;

  // ===== SINCRONIZAR SKU PADRE → HIJOS =====
  // Cuando el usuario modifica el SKU del padre, todos los SKUs de los hijos
  // que tengan el prefijo anterior se actualizan automáticamente.
  const parentSku = watch('sku');
  const prevParentSkuRef = useRef<string>('');

  useEffect(() => {
    const prevSku = prevParentSkuRef.current;
    prevParentSkuRef.current = parentSku;

    if (!prevSku || prevSku === parentSku || children.length === 0) return;

    setChildren((prev) =>
      prev.map((child) => {
        if (child.sku.startsWith(`${prevSku}-`)) {
          const suffix = child.sku.slice(prevSku.length + 1);
          return { ...child, sku: parentSku ? `${parentSku}-${suffix}` : suffix };
        }
        return child;
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentSku]);

  // ===== SUBMIT TODO (padre + hijos) =====
  const onSubmit = handleSubmit(async (data) => {
    if (children.length === 0) {
      toast.error(translate('configurableCreate', 'noVariationsError'));
      return;
    }

    // Validar que todos los hijos tengan SKU, precio y stock
    const invalidChild = children.find(
      (c) => !c.sku || Number(c.price) <= 0 || Number(c.stock) <= 0
    );
    if (invalidChild) {
      toast.error(translate('configurableCreate', 'invalidChildError'));
      return;
    }

    // Validar que no haya SKUs duplicados entre variaciones
    const skus = children.map((c) => c.sku);
    const hasDuplicateSku = skus.some((s, i) => skus.indexOf(s) !== i);
    if (hasDuplicateSku) {
      toast.error(translate('configurableCreate', 'duplicateSkuError'));
      return;
    }

    const input = await buildPayload(
      data,
      images,
      children,
      selectedAttributes,
      ATTRIBUTE_SET_ID
    );

    await createConfigurable(input);
  });

  // ===== MANEJO DE IMÁGENES =====
  const handleAddImages = useCallback((newImages: ImagePreview[]) => {
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  // ===== MANEJO DE ATRIBUTOS =====
  const handleSelectAttribute = useCallback(
    (attr: MagentoConfigurableAttribute | null) => {
      if (!attr) return;
      if (selectedAttributes.some((sa) => sa.attribute.code === attr.code)) return;
      setSelectedAttributes((prev) => [...prev, { attribute: attr, selectedValues: [] }]);
    },
    [selectedAttributes]
  );

  const handleRemoveAttribute = useCallback((attrCode: string) => {
    setSelectedAttributes((prev) => prev.filter((sa) => sa.attribute.code !== attrCode));
    setChildren([]);
  }, []);

  /** Alterna la selección de un valor dentro de un atributo */
  const handleToggleOptionValue = useCallback((attrCode: string, valueId: string) => {
    setSelectedAttributes((prev) =>
      prev.map((sa) => {
        if (sa.attribute.code !== attrCode) return sa;
        const exists = sa.selectedValues.includes(valueId);
        return {
          ...sa,
          selectedValues: exists
            ? sa.selectedValues.filter((v) => v !== valueId)
            : [...sa.selectedValues, valueId],
        };
      })
    );
    setChildren([]);
  }, []);

  // ===== GENERAR COMBINACIONES =====
  /** Busca el label de un valor de atributo por su ID */
  const getOptionLabel = useCallback(
    (attributeCode: string, valueId: string): string => {
      const sa = selectedAttributes.find((s) => s.attribute.code === attributeCode);
      return sa?.attribute.options.find((o) => o.value === valueId)?.label ?? valueId;
    },
    [selectedAttributes]
  );

  const handleGenerateCombinations = useCallback(() => {
    const sku = methods.getValues('sku');
    const baseName = methods.getValues('name');
    const combos = generateCombinations(selectedAttributes);
    const newChildren: ConfigurableChildInput[] = combos.map((combo) => {
      const suffix = Object.entries(combo)
        .map(([attrCode, valId]) => getOptionLabel(attrCode, valId))
        .join('-');

      // Sanitizar suffix para SKU: sin espacios ni caracteres especiales
      const skuSuffix = suffix.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-_]/g, '');

      // Precio según configuración masiva
      let childPrice = 0;
      if (priceMode === 'single') {
        childPrice = bulkPrice;
      } else if (priceMode === 'byAttribute' && priceAttr && combo[priceAttr]) {
        childPrice = pricesByValue[combo[priceAttr]] ?? 0;
      }

      // Cantidad según configuración masiva
      let childQty = 0;
      if (qtyMode === 'single') {
        childQty = bulkQty;
      } else if (qtyMode === 'byAttribute' && qtyAttr && combo[qtyAttr]) {
        childQty = qtiesByValue[combo[qtyAttr]] ?? 0;
      }

      // Imágenes según configuración masiva
      let childFiles: File[] | undefined;
      if (imageMode === 'single' && bulkImages.length > 0) {
        childFiles = bulkImages.map((i) => i.file);
      } else if (imageMode === 'byAttribute' && imageAttr && combo[imageAttr]) {
        const valImgs = imagesByValue[combo[imageAttr]] ?? [];
        if (valImgs.length > 0) childFiles = valImgs.map((i) => i.file);
      }

      return {
        sku: sku ? `${sku}-${skuSuffix}` : skuSuffix,
        name: baseName ? `${baseName} ${suffix}` : suffix,
        price: childPrice,
        stock: childQty,
        attributes: combo,
        files: childFiles,
      };
    });
    setChildren(newChildren);
  }, [
    selectedAttributes, methods, getOptionLabel,
    priceMode, bulkPrice, priceAttr, pricesByValue,
    qtyMode, bulkQty, qtyAttr, qtiesByValue,
    imageMode, bulkImages, imageAttr, imagesByValue,
  ]);

  // ===== ACTUALIZAR HIJO =====
  const handleUpdateChild = useCallback(
    (
      index: number,
      field: keyof Pick<ConfigurableChildInput, 'sku' | 'name' | 'price' | 'stock'>,
      value: string | number
    ) => {
      setChildren((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    },
    []
  );

  /** Agrega imágenes a una variación específica */
  const handleAddChildImages = useCallback((index: number, newImages: ImagePreview[]) => {
    setChildren((prev) => {
      const updated = [...prev];
      const child = updated[index];
      const existingFiles = child.files ?? [];
      const existingImgs = child.images ?? [];
      updated[index] = {
        ...child,
        files: [...existingFiles, ...newImages.map((i) => i.file)],
        images: [...existingImgs, ...new Array<string>(newImages.length).fill('')],
      };
      return updated;
    });
  }, []);

  /** Elimina una imagen de una variación específica */
  const handleRemoveChildImage = useCallback((childIndex: number, imgIndex: number) => {
    setChildren((prev) => {
      const updated = [...prev];
      const child = updated[childIndex];
      const files = [...(child.files ?? [])];
      const imgs = [...(child.images ?? [])];
      files.splice(imgIndex, 1);
      imgs.splice(imgIndex, 1);
      updated[childIndex] = { ...child, files, images: imgs };
      return updated;
    });
  }, []);

  /** Elimina una variación de la lista */
  const handleDeleteChild = useCallback((index: number) => {
    setChildren((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /** Agrega una fila vacía en modo manual */
  const handleAddManualRow = useCallback(() => {
    const sku = methods.getValues('sku');
    const baseName = methods.getValues('name');
    setChildren((prev) => [
      ...prev,
      {
        sku: sku ? `${sku}-${prev.length + 1}` : `var-${prev.length + 1}`,
        name: baseName || '',
        price: 0,
        stock: 0,
        attributes: {},
      },
    ]);
  }, [methods]);

  /** Actualiza un atributo en una variación (modo manual) */
  const handleUpdateChildAttribute = useCallback(
    (childIndex: number, attrCode: string, value: string) => {
      setChildren((prev) => {
        const updated = [...prev];
        const child = { ...updated[childIndex] };
        child.attributes = { ...child.attributes, [attrCode]: value };
        const sku = methods.getValues('sku');
        const baseName = methods.getValues('name');
        const parts = selectedAttributes
          .map((sa) => {
            const v = child.attributes[sa.attribute.code];
            return v ? getOptionLabel(sa.attribute.code, v) : '';
          })
          .filter(Boolean);
        if (parts.length > 0) {
          const suffix = parts.join('-');
          const skuSuffix = suffix.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-_]/g, '');
          child.sku = sku ? `${sku}-${skuSuffix}` : skuSuffix;
          child.name = baseName ? `${baseName} ${suffix}` : suffix;
        }
        updated[childIndex] = child;
        return updated;
      });
    },
    [selectedAttributes, methods, getOptionLabel]
  );

  /** Verifica si una combinación ya existe en otra fila */
  const isDuplicateRow = useCallback(
    (childIndex: number): boolean => {
      const child = children[childIndex];
      if (!child) return false;
      const allFilled = selectedAttributes.every(
        (sa) => child.attributes[sa.attribute.code]
      );
      if (!allFilled) return false;
      return children.some((other, idx) => {
        if (idx === childIndex) return false;
        return selectedAttributes.every(
          (sa) => other.attributes[sa.attribute.code] === child.attributes[sa.attribute.code]
        );
      });
    },
    [children, selectedAttributes]
  );

  // ------------------------------------------------------------------

  const hasValidAttributes =
    selectedAttributes.length > 0 &&
    selectedAttributes.every((sa) => sa.selectedValues.length > 0);
  const hasChildren = children.length > 0;

  // ------------------------------------------------------------------

  return (
    <HomeContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading={translate('configurableCreate', 'heading')}
        links={[
          { name: translate('productList', 'breadcrumbHome'), href: paths.home.root },
          { name: translate('productList', 'breadcrumbProduct'), href: paths.product.root },
          { name: translate('configurableCreate', 'breadcrumbCreate') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* ===== BANNER INFORMATIVO ===== */}
      <Alert
        severity="info"
        icon={<Iconify icon="solar:info-circle-bold" width={24} />}
        sx={{ mb: 3 }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {translate('configurableCreate', 'infoBannerTitle')}
        </Typography>
        <Typography variant="body2">
          {translate('configurableCreate', 'infoBannerDescription')}
        </Typography>
      </Alert>

      <Form methods={methods} onSubmit={onSubmit}>
        <Box sx={{ position: 'relative' }}>
          <SectionLoadingOverlay
            open={isPending}
            message={translate('configurableCreate', 'loadingMessage')}
          />
        <Stack spacing={3}>
          {/* ════════════════════════════════════════════════════════════
              SECCIÓN 1: CREACIÓN DEL PRODUCTO BASE
              ════════════════════════════════════════════════════════════ */}
          <Card sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                1
              </Box>
              <Typography variant="h6">
                {translate('configurableCreate', 'baseProductTitle')}
              </Typography>
            </Stack>

            <Box
              sx={{
                gap: 3,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="sku" label={translate('productCreate', 'sku')} />
              <Field.Text name="name" label={translate('productCreate', 'productName')} />
              <CategoryTreeSelect
                name="categoryId"
                label={translate('productCreate', 'category')}
                placeholder={translate('productCreate', 'selectCategory')}
                loadingText={translate('productCreate', 'loadingCategories')}
                categoryTree={categoryTree}
                loading={categoriesLoading}
                selectedLabel={translate('productCreate', 'selectedCategories')}
                sx={{ gridColumn: '1 / -1' }}
              />
              <PriceField label={translate('productCreate', 'price')} />
              <WeightField label={translate('productCreate', 'weight')} />
              <Field.Text
                name="shortDescription"
                label={translate('productCreate', 'shortDescription')}
                multiline
                rows={3}
                sx={{ gridColumn: '1 / -1' }}
              />
            </Box>
          </Card>

          {/* Descripción completa */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {translate('productCreate', 'descriptionSection')}
            </Typography>
            <Field.Editor
              name="description"
              placeholder={translate('productCreate', 'descriptionPlaceholder')}
            />
          </Card>

          {/* Imágenes */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {translate('productCreate', 'imagesSection')}
            </Typography>
            <ProductImageUpload
              images={images}
              onAdd={handleAddImages}
              onRemove={handleRemoveImage}
              maxImages={5}
              maxSizeKB={100}
            />
          </Card>

          {/* ════════════════════════════════════════════════════════════
              SECCIÓN 2: VARIACIONES DEL PRODUCTO
              ════════════════════════════════════════════════════════════ */}
          <Card sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                2
              </Box>
              <Typography variant="h6">
                {translate('configurableCreate', 'variationsSectionTitle')}
              </Typography>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              {translate('configurableCreate', 'attributesHint')}
            </Typography>

            {/* Selector de atributo desde Magento con buscador */}
            <Autocomplete
              options={magentoAttributes.filter(
                (a) => !selectedAttributes.some((sa) => sa.attribute.code === a.code)
              )}
              getOptionLabel={(opt) => `${opt.label} (${opt.code})`}
              loading={attributesLoading}
              onChange={(_, value) => handleSelectAttribute(value)}
              value={null}
              blurOnSelect
              noOptionsText={translate('configurableCreate', 'noAttributeFound')}
              sx={{ mb: 3, maxWidth: 500 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label={translate('configurableCreate', 'selectAttributeLabel')}
                  placeholder={translate('configurableCreate', 'selectAttributePlaceholder')}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {attributesLoading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
            />

            {/* Lista de atributos seleccionados con sus opciones seleccionables */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: `repeat(${Math.min(selectedAttributes.length || 1, 3)}, 1fr)`,
                },
                gap: 2,
              }}
            >
              {selectedAttributes.map((sa) => (
                <Card
                  key={sa.attribute.code}
                  variant="outlined"
                  sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle2">
                        {sa.attribute.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        ({sa.attribute.code})
                      </Typography>
                    </Stack>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveAttribute(sa.attribute.code)}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                    </IconButton>
                  </Stack>

                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {translate('configurableCreate', 'selectValuesHint')} ({sa.selectedValues.length}/{sa.attribute.options.length})
                  </Typography>

                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {sa.attribute.options.map((opt) => {
                      const isSelected = sa.selectedValues.includes(opt.value);
                      return (
                        <Chip
                          key={opt.value}
                          label={opt.label}
                          size="small"
                          variant={isSelected ? 'filled' : 'outlined'}
                          color={isSelected ? 'primary' : 'default'}
                          onClick={() => handleToggleOptionValue(sa.attribute.code, opt.value)}
                          sx={{ cursor: 'pointer' }}
                        />
                      );
                    })}
                  </Stack>
                </Card>
              ))}
            </Box>

            {/* ═══ MODO DE CONFIGURACIÓN ═══ */}
            {hasValidAttributes && (
              <Tabs
                value={configMode}
                onChange={(_, v) => setConfigMode(v)}
                sx={{ mt: 3, borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab
                  value="bulk"
                  label={translate('configurableCreate', 'bulkModeTab')}
                  icon={<Iconify icon="solar:list-bold" width={20} />}
                  iconPosition="start"
                />
                <Tab
                  value="manual"
                  label={translate('configurableCreate', 'manualModeTab')}
                  icon={<Iconify icon="solar:pen-bold" width={20} />}
                  iconPosition="start"
                />
              </Tabs>
            )}

            {hasValidAttributes && configMode === 'bulk' && (
              <Card variant="outlined" sx={{ p: 3, mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {translate('configurableCreate', 'bulkConfigTitle')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  {translate('configurableCreate', 'bulkConfigHint')}
                </Typography>

                {/* ── Imágenes ── */}
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {translate('productCreate', 'imagesSection')}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <RadioGroup
                  value={imageMode}
                  onChange={(e) => { setImageMode(e.target.value as BulkMode); setChildren([]); }}
                  sx={{ mb: 2 }}
                >
                  <FormControlLabel
                    value="single"
                    control={<Radio size="small" />}
                    label={translate('configurableCreate', 'imagesSingleLabel')}
                  />
                  <FormControlLabel
                    value="byAttribute"
                    control={<Radio size="small" />}
                    label={translate('configurableCreate', 'imagesByAttrLabel')}
                  />
                  <FormControlLabel
                    value="skip"
                    control={<Radio size="small" />}
                    label={translate('configurableCreate', 'imagesSkipLabel')}
                  />
                </RadioGroup>

                {imageMode === 'single' && (
                  <Box sx={{ mb: 3, pl: 4 }}>
                    <ProductImageUpload
                      images={bulkImages}
                      onAdd={(imgs) => setBulkImages((prev) => [...prev, ...imgs])}
                      onRemove={(i) => {
                        setBulkImages((prev) => {
                          const u = [...prev];
                          URL.revokeObjectURL(u[i].preview);
                          u.splice(i, 1);
                          return u;
                        });
                      }}
                      maxImages={5}
                      maxSizeKB={100}
                    />
                  </Box>
                )}

                {imageMode === 'byAttribute' && (
                  <Box sx={{ mb: 3, pl: 4 }}>
                    {selectedAttributes.length > 1 && (
                      <TextField
                        select
                        size="small"
                        label={translate('configurableCreate', 'selectGroupAttr')}
                        value={imageAttr}
                        onChange={(e) => { setImageAttr(e.target.value); setImagesByValue({}); }}
                        sx={{ mb: 2, minWidth: 250 }}
                      >
                        {selectedAttributes.map((sa) => (
                          <MenuItem key={sa.attribute.code} value={sa.attribute.code}>
                            {sa.attribute.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                    {(imageAttr || selectedAttributes.length === 1) && (() => {
                      const attrCode = imageAttr || selectedAttributes[0].attribute.code;
                      if (!imageAttr && selectedAttributes.length === 1 && imageAttr !== attrCode) {
                        // Auto-select if single attribute
                        setTimeout(() => setImageAttr(attrCode), 0);
                      }
                      const sa = selectedAttributes.find((s) => s.attribute.code === attrCode);
                      return sa?.selectedValues.map((valId) => {
                        const optLabel = sa.attribute.options.find((o) => o.value === valId)?.label ?? valId;
                        return (
                          <Box key={valId} sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                              {sa.attribute.label}: {optLabel}
                            </Typography>
                            <ProductImageUpload
                              images={imagesByValue[valId] ?? []}
                              onAdd={(imgs) =>
                                setImagesByValue((prev) => ({
                                  ...prev,
                                  [valId]: [...(prev[valId] ?? []), ...imgs],
                                }))
                              }
                              onRemove={(i) =>
                                setImagesByValue((prev) => {
                                  const arr = [...(prev[valId] ?? [])];
                                  URL.revokeObjectURL(arr[i].preview);
                                  arr.splice(i, 1);
                                  return { ...prev, [valId]: arr };
                                })
                              }
                              maxImages={5}
                              maxSizeKB={100}
                            />
                          </Box>
                        );
                      });
                    })()}
                  </Box>
                )}

                {/* ── Precio ── */}
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {translate('productCreate', 'price')}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <RadioGroup
                  value={priceMode}
                  onChange={(e) => { setPriceMode(e.target.value as BulkMode); setChildren([]); }}
                  sx={{ mb: 2 }}
                >
                  <FormControlLabel
                    value="single"
                    control={<Radio size="small" />}
                    label={translate('configurableCreate', 'priceSingleLabel')}
                  />
                  <FormControlLabel
                    value="byAttribute"
                    control={<Radio size="small" />}
                    label={translate('configurableCreate', 'priceByAttrLabel')}
                  />
                  <FormControlLabel
                    value="skip"
                    control={<Radio size="small" />}
                    label={translate('configurableCreate', 'priceSkipLabel')}
                  />
                </RadioGroup>

                {priceMode === 'single' && (
                  <Box sx={{ mb: 3, pl: 4, maxWidth: 300 }}>
                    <FormattedPriceInput
                      value={bulkPrice}
                      onChange={setBulkPrice}
                      label={translate('productCreate', 'price')}
                      fullWidth
                    />
                  </Box>
                )}

                {priceMode === 'byAttribute' && (
                  <Box sx={{ mb: 3, pl: 4 }}>
                    {selectedAttributes.length > 1 && (
                      <TextField
                        select
                        size="small"
                        label={translate('configurableCreate', 'selectGroupAttr')}
                        value={priceAttr}
                        onChange={(e) => { setPriceAttr(e.target.value); setPricesByValue({}); }}
                        sx={{ mb: 2, minWidth: 250 }}
                      >
                        {selectedAttributes.map((sa) => (
                          <MenuItem key={sa.attribute.code} value={sa.attribute.code}>
                            {sa.attribute.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                    {(priceAttr || selectedAttributes.length === 1) && (() => {
                      const attrCode = priceAttr || selectedAttributes[0].attribute.code;
                      if (!priceAttr && selectedAttributes.length === 1) {
                        setTimeout(() => setPriceAttr(attrCode), 0);
                      }
                      const sa = selectedAttributes.find((s) => s.attribute.code === attrCode);
                      return (
                        <Stack spacing={2}>
                          {sa?.selectedValues.map((valId) => {
                            const optLabel = sa.attribute.options.find((o) => o.value === valId)?.label ?? valId;
                            return (
                              <Stack key={valId} direction="row" alignItems="center" spacing={2}>
                                <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 120 }}>
                                  {optLabel}
                                </Typography>
                                <FormattedPriceInput
                                  value={pricesByValue[valId] ?? 0}
                                  onChange={(v) => setPricesByValue((prev) => ({ ...prev, [valId]: v }))}
                                />
                              </Stack>
                            );
                          })}
                        </Stack>
                      );
                    })()}
                  </Box>
                )}

                {/* ── Cantidad ── */}
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  {translate('productCreate', 'stock')}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <RadioGroup
                  value={qtyMode}
                  onChange={(e) => { setQtyMode(e.target.value as BulkMode); setChildren([]); }}
                  sx={{ mb: 2 }}
                >
                  <FormControlLabel
                    value="single"
                    control={<Radio size="small" />}
                    label={translate('configurableCreate', 'qtySingleLabel')}
                  />
                  <FormControlLabel
                    value="byAttribute"
                    control={<Radio size="small" />}
                    label={translate('configurableCreate', 'qtyByAttrLabel')}
                  />
                  <FormControlLabel
                    value="skip"
                    control={<Radio size="small" />}
                    label={translate('configurableCreate', 'qtySkipLabel')}
                  />
                </RadioGroup>

                {qtyMode === 'single' && (
                  <Box sx={{ mb: 3, pl: 4, maxWidth: 300 }}>
                    <TextField
                      size="small"
                      type="number"
                      fullWidth
                      label={translate('productCreate', 'stock')}
                      value={bulkQty || ''}
                      onChange={(e) => setBulkQty(Number(e.target.value))}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Box>
                )}

                {qtyMode === 'byAttribute' && (
                  <Box sx={{ mb: 3, pl: 4 }}>
                    {selectedAttributes.length > 1 && (
                      <TextField
                        select
                        size="small"
                        label={translate('configurableCreate', 'selectGroupAttr')}
                        value={qtyAttr}
                        onChange={(e) => { setQtyAttr(e.target.value); setQtiesByValue({}); }}
                        sx={{ mb: 2, minWidth: 250 }}
                      >
                        {selectedAttributes.map((sa) => (
                          <MenuItem key={sa.attribute.code} value={sa.attribute.code}>
                            {sa.attribute.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                    {(qtyAttr || selectedAttributes.length === 1) && (() => {
                      const attrCode = qtyAttr || selectedAttributes[0].attribute.code;
                      if (!qtyAttr && selectedAttributes.length === 1) {
                        setTimeout(() => setQtyAttr(attrCode), 0);
                      }
                      const sa = selectedAttributes.find((s) => s.attribute.code === attrCode);
                      return (
                        <Stack spacing={2}>
                          {sa?.selectedValues.map((valId) => {
                            const optLabel = sa.attribute.options.find((o) => o.value === valId)?.label ?? valId;
                            return (
                              <Stack key={valId} direction="row" alignItems="center" spacing={2}>
                                <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 120 }}>
                                  {optLabel}
                                </Typography>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={qtiesByValue[valId] ?? ''}
                                  onChange={(e) => setQtiesByValue((prev) => ({ ...prev, [valId]: Number(e.target.value) }))}
                                  sx={{ minWidth: 120 }}
                                  slotProps={{ inputLabel: { shrink: true } }}
                                />
                              </Stack>
                            );
                          })}
                        </Stack>
                      );
                    })()}
                  </Box>
                )}

                {/* Botón generar combinaciones */}
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    onClick={handleGenerateCombinations}
                    startIcon={<Iconify icon="solar:list-bold" />}
                  >
                    {translate('configurableCreate', 'generateCombinations')}
                  </Button>
                </Stack>
              </Card>
            )}
          </Card>

          {/* ═══════ TABLA RESUMEN DE VARIACIONES ═══════ */}
          {(hasChildren || (configMode === 'manual' && hasValidAttributes)) && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {translate('configurableCreate', 'variationsTitle')} ({children.length})
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                {translate('configurableCreate', 'summaryHint')}
              </Typography>

              <Box sx={{ overflowX: 'auto' }}>
                <Box
                  component="table"
                  sx={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    '& th, & td': {
                      p: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      textAlign: 'left',
                      verticalAlign: 'middle',
                    },
                    '& th': {
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      color: 'text.secondary',
                      whiteSpace: 'nowrap',
                      bgcolor: 'background.neutral',
                    },
                  }}
                >
                  <thead>
                    <tr>
                      <th>{translate('productCreate', 'imagesSection')}</th>
                      <th>SKU</th>
                      <th>{translate('configurableCreate', 'childName')}</th>
                      {selectedAttributes.map((sa) => (
                        <th key={sa.attribute.code}>{sa.attribute.label}</th>
                      ))}
                      <th>{translate('productCreate', 'price')}</th>
                      <th>{translate('productCreate', 'stock')}</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {children.map((child, idx) => {
                      const duplicate = isDuplicateRow(idx);
                      return (
                        <tr key={idx} style={duplicate ? { backgroundColor: 'rgba(255,86,48,0.08)' } : undefined}>
                          {/* Imágenes inline */}
                          <td>
                            <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                              {(child.files ?? []).map((file, imgIdx) => (
                                <Box key={imgIdx} sx={{ position: 'relative', width: 40, height: 40 }}>
                                  <Box
                                    component="img"
                                    src={URL.createObjectURL(file)}
                                    alt=""
                                    sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRemoveChildImage(idx, imgIdx)}
                                    sx={{
                                      p: 0, position: 'absolute', top: -6, right: -6,
                                      width: 16, height: 16,
                                      bgcolor: 'error.main', color: 'white',
                                      '&:hover': { bgcolor: 'error.dark' },
                                    }}
                                  >
                                    <Iconify icon="mingcute:close-line" width={10} />
                                  </IconButton>
                                </Box>
                              ))}
                              <IconButton
                                component="label"
                                size="small"
                                sx={{ width: 40, height: 40, border: '1px dashed', borderColor: 'text.disabled', borderRadius: 0.5 }}
                              >
                                <Iconify icon="solar:camera-add-bold" width={18} sx={{ color: 'text.secondary' }} />
                                <input
                                  type="file"
                                  hidden
                                  multiple
                                  accept="image/png,image/jpeg"
                                  onChange={(e) => {
                                    const fl = Array.from(e.target.files ?? []);
                                    const imgs = fl.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
                                    handleAddChildImages(idx, imgs);
                                    e.target.value = '';
                                  }}
                                />
                              </IconButton>
                            </Stack>
                          </td>
                          {/* SKU */}
                          <td>
                            <TextField
                              size="small"
                              value={child.sku}
                              onChange={(e) => handleUpdateChild(idx, 'sku', e.target.value)}
                              sx={{ minWidth: 160 }}
                              slotProps={{ input: { title: String(child.sku ?? '') } }}
                            />
                          </td>
                          {/* Nombre */}
                          <td>
                            <TextField
                              size="small"
                              value={child.name}
                              onChange={(e) => handleUpdateChild(idx, 'name', e.target.value)}
                              sx={{ minWidth: 180 }}
                              slotProps={{ input: { title: String(child.name ?? '') } }}
                            />
                          </td>
                          {/* Atributos */}
                          {selectedAttributes.map((sa) => (
                            <td key={sa.attribute.code}>
                              {configMode === 'manual' ? (
                                <TextField
                                  select
                                  size="small"
                                  value={child.attributes[sa.attribute.code] ?? ''}
                                  onChange={(e) => handleUpdateChildAttribute(idx, sa.attribute.code, e.target.value)}
                                  sx={{ minWidth: 100 }}
                                  error={duplicate}
                                >
                                  <MenuItem value="">
                                    <em>—</em>
                                  </MenuItem>
                                  {sa.selectedValues.map((valId) => (
                                    <MenuItem key={valId} value={valId}>
                                      {sa.attribute.options.find((o) => o.value === valId)?.label ?? valId}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              ) : (
                                <Chip
                                  label={getOptionLabel(sa.attribute.code, child.attributes[sa.attribute.code])}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              )}
                            </td>
                          ))}
                          {/* Precio */}
                          <td>
                            <FormattedPriceInput
                              value={child.price}
                              onChange={(v) => handleUpdateChild(idx, 'price', v)}
                              showTooltip
                            />
                          </td>
                          {/* Stock */}
                          <td>
                            <TextField
                              size="small"
                              type="number"
                              value={child.stock || ''}
                              onChange={(e) => handleUpdateChild(idx, 'stock', Number(e.target.value))}
                              sx={{ minWidth: 80 }}
                              slotProps={{ input: { title: String(child.stock ?? '') } }}
                            />
                          </td>
                          {/* Eliminar */}
                          <td>
                            <Tooltip title={translate('configurableCreate', 'deleteVariation')}>
                              <IconButton size="small" color="error" onClick={() => handleDeleteChild(idx)}>
                                <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Box>
              </Box>

              {/* Botón agregar fila manual */}
              {configMode === 'manual' && (
                <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="solar:add-circle-bold" width={20} />}
                    onClick={handleAddManualRow}
                  >
                    {translate('configurableCreate', 'addVariationRow')}
                  </Button>
                </Stack>
              )}

              {/* Alerta de duplicados */}
              {children.some((_, idx) => isDuplicateRow(idx)) && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {translate('configurableCreate', 'duplicateWarning')}
                </Alert>
              )}
            </Card>
          )}

          <Divider />

          {/* ===== BOTÓN ENVIAR TODO ===== */}
          <Stack direction="row" justifyContent="flex-end">
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isPending}
              disabled={!hasChildren}
            >
              {translate('configurableCreate', 'savePublish')}
            </LoadingButton>
          </Stack>
        </Stack>
        </Box>
      </Form>
    </HomeContent>
  );
}
