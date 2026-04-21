'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { CategoryChildInterface } from 'src/interfaces';

import { useState, useEffect, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

interface CategoryCascadeSelectProps {
  /** Nombre del campo en el formulario (react-hook-form) */
  name: string;
  /** Etiqueta del selector */
  label: string;
  /** Texto del placeholder para seleccionar */
  placeholder?: string;
  /** Texto mientras carga */
  loadingText?: string;
  /** Título del panel de categorías seleccionadas */
  selectedLabel?: string;
  /** Árbol de categorías del hook useCategories */
  categoryTree: CategoryChildInterface[];
  /** ¿Está cargando las categorías? */
  loading?: boolean;
  /** Deshabilitado */
  disabled?: boolean;
  /** Estilos del contenedor raíz */
  sx?: SxProps<Theme>;
}

// ----------------------------------------------------------------------

/**
 * Dado un ID de categoría y el árbol completo, retorna la cadena
 * de ancestros desde la raíz hasta esa categoría (inclusive).
 */
function findPathToCategory(
  tree: CategoryChildInterface[],
  targetId: number
): CategoryChildInterface[] | null {
  for (const node of tree) {
    if (node.id === targetId) return [node];
    if (node.children?.length) {
      const childPath = findPathToCategory(node.children, targetId);
      if (childPath) return [node, ...childPath];
    }
  }
  return null;
}

/**
 * Resuelve las opciones del nivel actual a partir del árbol y las selecciones previas.
 */
function getCurrentOptions(
  tree: CategoryChildInterface[],
  selectedNodes: CategoryChildInterface[]
): CategoryChildInterface[] {
  if (selectedNodes.length === 0) return tree;
  const lastNode = selectedNodes[selectedNodes.length - 1];
  return lastNode.children?.length ? lastNode.children : [];
}

// ----------------------------------------------------------------------

/**
 * Selector de categorías con chips en cascada.
 * Cada selección se convierte en un chip y el select avanza al siguiente nivel.
 */
export function CategoryCascadeSelect({
  name,
  label,
  placeholder = 'Selecciona una categoría',
  loadingText = 'Cargando categorías...',
  selectedLabel = 'Categorías seleccionadas',
  categoryTree,
  loading = false,
  disabled = false,
  sx,
}: CategoryCascadeSelectProps) {
  const { control, setValue } = useFormContext();

  // Nodos completos seleccionados (para mostrar nombre en chips)
  const [selectedNodes, setSelectedNodes] = useState<CategoryChildInterface[]>([]);

  // Reconstruir selecciones si el formulario ya tiene un valor (edición)
  useEffect(() => {
    if (!categoryTree.length) return;
    const currentValue = control._getWatch(name);
    if (!currentValue) return;

    const targetId = Number(currentValue);
    if (Number.isNaN(targetId)) return;

    const path = findPathToCategory(categoryTree, targetId);
    if (path && path.length > 0) {
      setSelectedNodes(path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryTree]);

  const handleSelect = useCallback(
    (categoryId: number) => {
      // Buscar el nodo en las opciones del nivel actual
      const currentOptions = getCurrentOptions(categoryTree, selectedNodes);
      const node = currentOptions.find((cat) => cat.id === categoryId);
      if (!node) return;

      const next = [...selectedNodes, node];
      setSelectedNodes(next);
      setValue(name, String(categoryId), { shouldValidate: true, shouldDirty: true });
    },
    [categoryTree, selectedNodes, name, setValue]
  );

  const handleRemoveFrom = useCallback(
    (index: number) => {
      // Eliminar desde este chip en adelante
      const next = selectedNodes.slice(0, index);
      setSelectedNodes(next);

      if (next.length > 0) {
        // El valor del form es el último nodo que queda
        const lastNode = next[next.length - 1];
        setValue(name, String(lastNode.id), { shouldValidate: true, shouldDirty: true });
      } else {
        // No queda ninguno, limpiar valor
        setValue(name, '', { shouldValidate: true, shouldDirty: true });
      }
    },
    [selectedNodes, name, setValue]
  );

  // Opciones para el select actual
  const currentOptions = getCurrentOptions(categoryTree, selectedNodes);

  // ¿El último seleccionado ya no tiene hijos? → no mostrar más select
  const lastNode = selectedNodes.length > 0 ? selectedNodes[selectedNodes.length - 1] : null;
  const showSelect = !lastNode || (lastNode.children?.length ?? 0) > 0;

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState: { error } }) => (
        <Box
          sx={[
            {
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
              alignItems: 'start',
            },
            ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
          ]}
        >
          {/* ── Select del nivel actual (izquierda) ── */}
          <Box>
            {showSelect ? (
              <TextField
                select
                fullWidth
                label={selectedNodes.length === 0 ? label : `Subcategoría`}
                value=""
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!Number.isNaN(val)) handleSelect(val);
                }}
                disabled={disabled || loading}
                error={!!error}
                helperText={error?.message}
                slotProps={{
                  inputLabel: { shrink: true },
                  select: {
                    MenuProps: {
                      slotProps: { paper: { sx: { maxHeight: 300 } } },
                    },
                  },
                }}
              >
                {loading ? (
                  <MenuItem value="" disabled>
                    {loadingText}
                  </MenuItem>
                ) : (
                  [
                    <MenuItem key="placeholder" value="" disabled>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {placeholder}
                      </Typography>
                    </MenuItem>,
                    ...currentOptions.map((cat) => (
                      <MenuItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                        {cat.children?.length ? (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ ml: 1, color: 'text.disabled' }}
                          >
                            ▸
                          </Typography>
                        ) : null}
                      </MenuItem>
                    )),
                  ]
                )}
              </TextField>
            ) : (
              <TextField
                fullWidth
                label={label}
                value={selectedNodes.map((n) => n.name).join(' › ')}
                slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}
                disabled={disabled}
              />
            )}
          </Box>

          {/* ── Panel de categorías seleccionadas (derecha) ── */}
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 1.5,
              minHeight: 56,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {selectedLabel}
            </Typography>

            {selectedNodes.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center' }}>
                {selectedNodes.map((node, index) => (
                  <Box key={node.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {index > 0 && (
                      <Typography
                        component="span"
                        sx={{ color: 'text.disabled', fontSize: 16, lineHeight: 1 }}
                      >
                        ›
                      </Typography>
                    )}
                    <Chip
                      label={node.name}
                      size="small"
                      onDelete={() => handleRemoveFrom(index)}
                      sx={{
                        fontWeight: 500,
                        bgcolor: 'common.black',
                        color: 'common.white',
                        '& .MuiChip-deleteIcon': {
                          color: 'grey.500',
                          fontSize: 16,
                          '&:hover': { color: 'error.light' },
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                {placeholder}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    />
  );
}
