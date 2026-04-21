'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { CategoryChildInterface } from 'src/interfaces';

import { Controller, useFormContext } from 'react-hook-form';
import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

import { Iconify } from 'src/components/iconify';

// ── Generador de colores dinámico basado en HSL ──────────────────────
// Genera colores bien distribuidos usando proporción áurea para evitar repetición.

function generateColor(index: number): string {
  const GOLDEN_ANGLE = 137.508; // grados
  const hue = (index * GOLDEN_ANGLE) % 360;
  const saturation = 55 + (index % 3) * 10; // 55-75%
  const lightness = 40 + (index % 4) * 5;   // 40-55%
  return `hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`;
}

// ── Contexto para pasar metadata a los TreeItem ──────────────────────

interface NodeMeta {
  rootIndex: number;
  hasChildren: boolean;
  depth: number;
}

const NodeMetaContext = createContext<Map<string, NodeMeta>>(new Map());
const SelectedItemContext = createContext<string | null>(null);
const OnSelectContext = createContext<(itemId: string) => void>(() => {});

/** Construye un mapa nodeId → { rootIndex, hasChildren, depth } recorriendo todo el árbol. */
function buildNodeMetaMap(tree: CategoryChildInterface[]): Map<string, NodeMeta> {
  const map = new Map<string, NodeMeta>();

  function traverse(nodes: CategoryChildInterface[], rootIndex: number, depth: number) {
    for (const node of nodes) {
      const hasChildren = (node.children?.length ?? 0) > 0;
      map.set(String(node.id), { rootIndex, hasChildren, depth });
      if (hasChildren) {
        traverse(node.children!, rootIndex, depth + 1);
      }
    }
  }

  tree.forEach((rootNode, index) => {
    const hasChildren = (rootNode.children?.length ?? 0) > 0;
    map.set(String(rootNode.id), { rootIndex: index, hasChildren, depth: 0 });
    if (hasChildren) {
      traverse(rootNode.children!, index, 1);
    }
  });

  return map;
}

// Indentación por nivel en px
const INDENT_PER_LEVEL = 20;

// ── Normalización para búsqueda sin acentos ──────────────────────────

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** Estructura aplanada de una categoría con su ruta de breadcrumbs. */
interface FlatCategory {
  id: number;
  name: string;
  breadcrumb: string[];
  normalizedName: string;
  normalizedBreadcrumb: string;
}

/** Aplana el árbol en una lista con rutas breadcrumb para búsqueda rápida. */
function flattenTree(
  nodes: CategoryChildInterface[],
  parentPath: string[] = []
): FlatCategory[] {
  const result: FlatCategory[] = [];
  for (const node of nodes) {
    const breadcrumb = [...parentPath, node.name];
    result.push({
      id: node.id,
      name: node.name,
      breadcrumb,
      normalizedName: normalize(node.name),
      normalizedBreadcrumb: normalize(breadcrumb.join(' ')),
    });
    if (node.children?.length) {
      result.push(...flattenTree(node.children, breadcrumb));
    }
  }
  return result;
}

// ----------------------------------------------------------------------

interface CategoryTreeSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  loadingText?: string;
  selectedLabel?: string;
  categoryTree: CategoryChildInterface[];
  loading?: boolean;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

// ── Helpers ──────────────────────────────────────────────────────────

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

function collectAncestorIds(
  tree: CategoryChildInterface[],
  targetId: number
): string[] {
  const path = findPathToCategory(tree, targetId);
  if (!path || path.length <= 1) return [];
  return path.slice(0, -1).map((n) => String(n.id));
}

// ── Componente ────────────────────────────────────────────────────────

export function CategoryTreeSelect({
  name,
  label = 'Categoría',
  placeholder = 'Selecciona una categoría',
  loadingText = 'Cargando categorías...',
  selectedLabel = 'Categorías seleccionadas',
  categoryTree,
  loading = false,
  disabled = false,
  sx,
}: CategoryTreeSelectProps) {
  const { control, setValue } = useFormContext();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const nodeMetaMap = useMemo(() => buildNodeMetaMap(categoryTree), [categoryTree]);
  const flatCategories = useMemo(() => flattenTree(categoryTree), [categoryTree]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const normalizedQuery = normalize(searchQuery.trim());
    return flatCategories
      .filter(
        (cat) =>
          cat.normalizedName.includes(normalizedQuery) ||
          cat.normalizedBreadcrumb.includes(normalizedQuery)
      )
      .slice(0, 20);
  }, [searchQuery, flatCategories]);

  const selectedPath = useMemo<CategoryChildInterface[]>(() => {
    if (!selectedItemId || !categoryTree.length) return [];
    return findPathToCategory(categoryTree, Number(selectedItemId)) ?? [];
  }, [selectedItemId, categoryTree]);

  useEffect(() => {
    if (!categoryTree.length) return;
    const currentValue = control._getWatch(name);
    if (!currentValue) return;

    const targetId = Number(currentValue);
    if (Number.isNaN(targetId)) return;

    const path = findPathToCategory(categoryTree, targetId);
    if (path?.length) {
      setSelectedItemId(String(targetId));
      setExpandedItems((prev) => {
        const ancestors = collectAncestorIds(categoryTree, targetId);
        const merged = new Set([...prev, ...ancestors]);
        return Array.from(merged);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryTree]);

  // Selección manejada exclusivamente desde el clic en el label (OnSelectContext)
  const handleItemSelect = useCallback(
    (itemId: string) => {
      setSelectedItemId(itemId);
      setValue(name, itemId, { shouldValidate: true, shouldDirty: true });
    },
    [name, setValue]
  );

  const handleExpandedItemsChange = useCallback(
    (_event: React.SyntheticEvent | null, itemIds: string[]) => {
      setExpandedItems(itemIds);
    },
    []
  );

  const handleRemoveFrom = useCallback(
    (index: number) => {
      const remaining = selectedPath.slice(0, index);
      if (remaining.length > 0) {
        const lastNode = remaining[remaining.length - 1];
        setSelectedItemId(String(lastNode.id));
        setValue(name, String(lastNode.id), { shouldValidate: true, shouldDirty: true });
      } else {
        setSelectedItemId(null);
        setValue(name, '', { shouldValidate: true, shouldDirty: true });
      }

      if (index === 0) {
        setExpandedItems([]);
      } else {
        const keepIds = new Set(remaining.map((n) => String(n.id)));
        setExpandedItems((prev) => prev.filter((id) => keepIds.has(id)));
      }
    },
    [selectedPath, name, setValue]
  );

  const handleSearchSelect = useCallback(
    (catId: number) => {
      const itemId = String(catId);
      setSelectedItemId(itemId);
      setValue(name, itemId, { shouldValidate: true, shouldDirty: true });

      // Expandir ancestros para que el nodo sea visible en el árbol
      const ancestors = collectAncestorIds(categoryTree, catId);
      setExpandedItems((prev) => {
        const merged = new Set([...prev, ...ancestors]);
        return Array.from(merged);
      });

      setSearchQuery('');
      setShowResults(false);
    },
    [categoryTree, name, setValue]
  );

  const getItemId = useCallback((item: CategoryChildInterface) => String(item.id), []);
  const getItemLabel = useCallback((item: CategoryChildInterface) => item.name, []);

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
          {/* ── Árbol de categorías (izquierda) ── */}
          <Box
            sx={{
              border: '1px solid',
              borderColor: error ? 'error.main' : 'divider',
              borderRadius: 1,
              overflow: 'hidden',
              transition: 'border-color 0.2s',
              '&:hover': {
                borderColor: error ? 'error.main' : 'text.primary',
              },
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.25,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                position: 'relative',
              }}
            >
              <Iconify icon="solar:add-folder-bold" width={18} sx={{ color: 'text.secondary' }} />
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', flexShrink: 0 }}>
                {label}
              </Typography>

              {/* ── Buscador ── */}
              <ClickAwayListener onClickAway={() => setShowResults(false)}>
                <Box sx={{ ml: 'auto', position: 'relative', maxWidth: 220, width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 0.75,
                      px: 1,
                      py: 0.25,
                      transition: 'border-color 0.2s',
                      '&:focus-within': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <Iconify
                      icon="eva:search-fill"
                      width={16}
                      sx={{ color: 'text.disabled', flexShrink: 0 }}
                    />
                    <InputBase
                      inputRef={searchInputRef}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowResults(true);
                      }}
                      onFocus={() => { if (searchQuery.trim()) setShowResults(true); }}
                      placeholder="Buscar categoría..."
                      sx={{
                        fontSize: '0.8rem',
                        flex: 1,
                        '& input': { py: 0.25, px: 0 },
                      }}
                    />
                    {searchQuery && (
                      <Box
                        component="button"
                        onClick={() => {
                          setSearchQuery('');
                          setShowResults(false);
                          searchInputRef.current?.focus();
                        }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          border: 'none',
                          bgcolor: 'transparent',
                          cursor: 'pointer',
                          p: 0,
                          color: 'text.disabled',
                          '&:hover': { color: 'text.primary' },
                        }}
                      >
                        <Iconify icon="mingcute:close-line" width={14} />
                      </Box>
                    )}
                  </Box>

                  {/* ── Dropdown de resultados ── */}
                  {showResults && searchResults.length > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        mt: 0.5,
                        zIndex: 10,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        boxShadow: (theme) => theme.shadows[8],
                        maxHeight: 240,
                        overflow: 'auto',
                      }}
                    >
                      {searchResults.map((cat) => {
                        const meta = nodeMetaMap.get(String(cat.id));
                        const rootColor = generateColor(meta?.rootIndex ?? 0);
                        return (
                          <Box
                            key={cat.id}
                            onClick={() => handleSearchSelect(cat.id)}
                            sx={{
                              px: 1.5,
                              py: 1,
                              cursor: 'pointer',
                              transition: 'background 0.15s',
                              '&:hover': {
                                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                              },
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                              '&:last-child': { borderBottom: 'none' },
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  bgcolor: rootColor,
                                  flexShrink: 0,
                                  display: 'inline-block',
                                }}
                              />
                              {cat.name}
                            </Typography>
                            {cat.breadcrumb.length > 1 && (
                              <Typography
                                variant="caption"
                                sx={{ color: 'text.disabled', mt: 0.25, display: 'block' }}
                              >
                                {cat.breadcrumb.join(' › ')}
                              </Typography>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  )}

                  {showResults && searchQuery.trim() && searchResults.length === 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        mt: 0.5,
                        zIndex: 10,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        boxShadow: (theme) => theme.shadows[8],
                        px: 1.5,
                        py: 1.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.disabled', fontStyle: 'italic', textAlign: 'center' }}
                      >
                        Sin resultados
                      </Typography>
                    </Box>
                  )}
                </Box>
              </ClickAwayListener>
            </Box>

            <Box
              sx={{
                maxHeight: 320,
                overflow: 'auto',
                minHeight: 100,
              }}
            >
              {loading ? (
                <Typography
                  variant="body2"
                  sx={{ color: 'text.disabled', p: 2, textAlign: 'center' }}
                >
                  {loadingText}
                </Typography>
              ) : categoryTree.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{ color: 'text.disabled', p: 2, textAlign: 'center' }}
                >
                  No hay categorías disponibles
                </Typography>
              ) : (
                <NodeMetaContext.Provider value={nodeMetaMap}>
                <SelectedItemContext.Provider value={selectedItemId}>
                <OnSelectContext.Provider value={handleItemSelect}>
                  <Box sx={{ minWidth: 'fit-content', px: 1, py: 1 }}>
                    <RichTreeView
                      items={categoryTree}
                      getItemId={getItemId}
                      getItemLabel={getItemLabel}
                      selectedItems={selectedItemId}
                      onSelectedItemsChange={() => {}}
                      expandedItems={expandedItems}
                      onExpandedItemsChange={handleExpandedItemsChange}
                      itemChildrenIndentation={INDENT_PER_LEVEL}
                      slots={{
                        item: CategoryTreeItem,
                      }}
                      sx={{
                        // Línea guía vertical en cada grupo de hijos
                        [`& .${treeItemClasses.groupTransition}`]: {
                          ml: `${INDENT_PER_LEVEL}px`,
                          pl: `${INDENT_PER_LEVEL - 4}px`,
                          borderLeft: '1px solid',
                          borderColor: 'divider',
                        },
                        [`& .${treeItemClasses.content}`]: {
                          borderRadius: 0.75,
                          py: 0.5,
                          px: 1,
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                          },
                        },
                        [`& .${treeItemClasses.selected}`]: {
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                          '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                          },
                        },
                        [`& .${treeItemClasses.label}`]: {
                          fontSize: '0.875rem',
                        },
                        [`& .${treeItemClasses.iconContainer}`]: {
                          minWidth: 24,
                        },
                      }}
                    />
                  </Box>
                </OnSelectContext.Provider>
                </SelectedItemContext.Provider>
                </NodeMetaContext.Provider>
              )}
            </Box>

            {error && (
              <Typography
                variant="caption"
                sx={{ color: 'error.main', px: 2, pb: 1, display: 'block' }}
              >
                {error.message}
              </Typography>
            )}
          </Box>

          {/* ── Panel de categorías seleccionadas (derecha) ── */}
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
              minHeight: 100,
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.25,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Iconify
                icon="solar:tag-horizontal-bold-duotone"
                width={18}
                sx={{ color: 'text.secondary' }}
              />
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {selectedLabel}
              </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              {selectedPath.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 0.75,
                      alignItems: 'center',
                    }}
                  >
                    {selectedPath.map((node, index) => {
                      const meta = nodeMetaMap.get(String(node.id));
                      const rootColor = generateColor(meta?.rootIndex ?? 0);
                      const isLast = index === selectedPath.length - 1;

                      return (
                        <Box
                          key={node.id}
                          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                          {index > 0 && (
                            <Iconify
                              icon="solar:double-alt-arrow-right-bold-duotone"
                              width={16}
                              sx={{ color: 'text.disabled', flexShrink: 0 }}
                            />
                          )}
                          <Chip
                            label={node.name}
                            size="small"
                            onDelete={() => handleRemoveFrom(index)}
                            sx={{
                              fontWeight: 500,
                              bgcolor: isLast ? rootColor : 'transparent',
                              color: isLast ? 'common.white' : 'text.primary',
                              border: isLast ? 'none' : '1px solid',
                              borderColor: isLast ? undefined : rootColor,
                              '& .MuiChip-deleteIcon': {
                                color: isLast ? 'rgba(255,255,255,0.7)' : 'text.disabled',
                                fontSize: 16,
                                '&:hover': { color: 'error.light' },
                              },
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>

                  <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5 }}>
                    Nivel {selectedPath.length} de profundidad
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 3,
                    gap: 1,
                  }}
                >
                  <Iconify
                    icon="solar:file-bold-duotone"
                    width={40}
                    sx={{ color: 'text.disabled', opacity: 0.5 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.disabled', fontStyle: 'italic' }}
                  >
                    {placeholder}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
    />
  );
}

// ── TreeItem personalizado con color heredado de la raíz ─────────────

function CategoryTreeItem(props: any) {
  const { itemId, label, children, ...other } = props;
  const metaMap = useContext(NodeMetaContext);
  const currentSelected = useContext(SelectedItemContext);
  const onSelect = useContext(OnSelectContext);
  const meta = metaMap.get(String(itemId));
  const rootColor = generateColor(meta?.rootIndex ?? 0);
  const hasRealChildren = meta?.hasChildren ?? false;
  const isSelected = currentSelected === String(itemId);

  const handleLabelClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(String(itemId));
    },
    [itemId, onSelect]
  );

  return (
    <TreeItem
      itemId={itemId}
      label={
        <Box
          onClick={handleLabelClick}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.25, cursor: 'pointer' }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              flexShrink: 0,
              bgcolor: rootColor,
              opacity: hasRealChildren ? 1 : 0.55,
            }}
          />
          <span>{label}</span>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isSelected && (
              <Iconify
                icon="eva:checkmark-fill"
                width={16}
                sx={{ color: 'success.main', flexShrink: 0 }}
              />
            )}
            {hasRealChildren && (
              <Typography
                component="span"
                variant="caption"
                sx={{ color: 'text.disabled', fontSize: 11 }}
              >
                ▸
              </Typography>
            )}
          </Box>
        </Box>
      }
      {...other}
    >
      {children}
    </TreeItem>
  );
}
