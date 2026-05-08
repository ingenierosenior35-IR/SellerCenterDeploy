import type { ImportMode } from 'src/interfaces/load/bulk-loading.interface';

import { parseCsv, type ParsedCsv } from './parse-csv';

type TranslateFn = (namespaceOrKey: string, keyOrDefault?: string, defaultValue?: string) => string;

const getMessage = (
  translate: TranslateFn | undefined,
  key: string,
  fallback: string
): string => (translate ? translate('productLoad', `errors.${key}`, fallback) : fallback);

// ----------------------------------------------------------------------
// Validación local del archivo CSV antes de enviarlo al backend.
//
// Política — el frontend valida SOLO lo estructural:
//  1. Tamaño y tipo del archivo.
//  2. Que el CSV se parsee correctamente (cantidad de columnas consistente).
//  3. Que el header `sku` esté presente y que cada fila tenga `sku` no vacío.
//
// Las reglas de negocio (qué columnas son obligatorias en CREATE vs UPDATE,
// qué valores son válidos por celda, etc.) se delegan al backend, que es
// la fuente de verdad y devuelve errores específicos por fila/campo.
// Esto evita rechazar CSVs válidos por un mismatch entre la política del
// front y la del backend.
//
// `EXPECTED_HEADERS` se mantiene como referencia documental, pero ya no
// se usa para validación de presencia (todas son opcionales a nivel front).
// ----------------------------------------------------------------------

export const EXPECTED_HEADERS = [
  'sku',
  'special_price',
  'product_type',
  'name',
  'description',
  'attribute_mapping_category',
  'special_from_date',
  'special_to_date',
  'is_in_stock',
  'stock',
  'weight',
  'images',
  'meta_title',
  'meta_keyword',
  'meta_description',
  'color',
  'manufacturer',
  'tier_price',
  'related_skus',
  'crosssell_skus',
  'upsell_skus',
  'seller_id',
] as const;

export type ExpectedHeader = (typeof EXPECTED_HEADERS)[number];

// 1 MB — límite del backend por base64/encoding.
export const CSV_MAX_BYTES = 1024 * 1024;

const ALLOWED_TYPES = new Set([
  'text/csv',
  'application/vnd.ms-excel',
  'application/csv',
  'text/plain',
]);

const isCsvByName = (name: string) => /\.csv$/i.test(name);

/**
 * Headers obligatorios a nivel front. Solo se exige `sku` siempre. El resto
 * lo valida el backend según `import_mode`.
 *
 * El parámetro `mode` se mantiene en la firma por compatibilidad con
 * consumidores existentes; actualmente la política es independiente del modo.
 */
export const getRequiredHeaders = (_mode: ImportMode): ExpectedHeader[] => ['sku'];

export interface CsvValidationOptions {
  mode: ImportMode;
  /** Si se pasa, se reusa el parseo en vez de re-leer el archivo. */
  parsed?: ParsedCsv;
  translate?: TranslateFn;
}

export interface CsvValidationResult {
  errors: string[];
  parsed: ParsedCsv | null;
  /** Índices de filas (0-based, sin contar header) con al menos un error local. */
  rowErrorIndexes: Set<number>;
  /** Errores agrupados por índice de fila para marcado en preview. */
  rowErrorMap: Map<number, string[]>;
}

const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      resolve(typeof result === 'string' ? result : '');
    };
    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer el archivo'));
    reader.readAsText(file, 'utf-8');
  });

/**
 * Valida un archivo CSV en cliente y retorna errores agregados + por fila.
 *
 * Mantiene compatibilidad con la firma antigua: si solo se pasa el `File`
 * (sin opciones), valida únicamente tamaño y tipo, replicando la conducta
 * previa del flujo (back-compat para callers que aún no conocen `mode`).
 */
export async function validateCsvFile(
  file: File,
  options?: Partial<CsvValidationOptions>
): Promise<string[]> {
  if (!file) {
    return [getMessage(options?.translate, 'fileRequired', 'Debe seleccionar un archivo CSV.')];
  }

  const errors: string[] = [];

  if (!ALLOWED_TYPES.has(file.type) && !isCsvByName(file.name)) {
    errors.push(getMessage(options?.translate, 'invalidType', 'El archivo debe tener formato CSV.'));
  }
  if (file.size > CSV_MAX_BYTES) {
    errors.push(
      getMessage(
        options?.translate,
        'tooBig',
        'El archivo CSV es demasiado grande. El tamaño máximo permitido es de 1 MB.'
      )
    );
  }

  // Back-compat: si no nos pasaron `mode`, no validamos contenido.
  if (!options?.mode) return errors;

  // Si hubo errores de tamaño/tipo, no tiene sentido seguir.
  if (errors.length > 0) return errors;

  let parsed: ParsedCsv;
  try {
    parsed = options.parsed ?? parseCsv(await readFileAsText(file));
  } catch {
    return [getMessage(options?.translate, 'readError', 'No se pudo leer el archivo.')];
  }

  if (parsed.headers.length === 0) {
    return [getMessage(options?.translate, 'empty', 'El archivo CSV está vacío.')];
  }

  const required = getRequiredHeaders(options.mode);
  const missing = required.filter((h) => !parsed.headers.includes(h));
  if (missing.length > 0) {
    errors.push(
      getMessage(
        options?.translate,
        'missingRequiredColumns',
        `Faltan columnas obligatorias: ${missing.join(', ')}.`
      )
    );
  }

  if (parsed.rows.length === 0) {
    errors.push(
      getMessage(options?.translate, 'noRows', 'El archivo CSV no contiene filas de datos.')
    );
  }

  return errors;
}

/**
 * Valida fila por fila a nivel ESTRUCTURAL únicamente:
 *  - Errores de parseo (cantidad de columnas inconsistente).
 *  - `sku` vacío (es lo único que el front no puede recuperar — es la clave).
 *
 * Cualquier otra validación de contenido se delega al backend, que devuelve
 * los errores específicos en la respuesta de `queueMassUploadImport`.
 */
export const validateCsvContent = (
  parsed: ParsedCsv,
  _mode: ImportMode,
  options?: { translate?: TranslateFn }
): CsvValidationResult => {
  const rowErrorMap = new Map<number, string[]>();

  // Errores globales de parseo (col mismatch).
  parsed.rowErrors.forEach(({ row, message }) => {
    const idx = row - 1;
    const list = rowErrorMap.get(idx) ?? [];
    list.push(message);
    rowErrorMap.set(idx, list);
  });

  parsed.rows.forEach((rowObj, idx) => {
    const sku = rowObj.sku;
    if (sku === undefined || sku === null || String(sku).trim() === '') {
      const existing = rowErrorMap.get(idx) ?? [];
      rowErrorMap.set(
        idx,
        [
          ...existing,
          getMessage(options?.translate, 'missingSku', 'Falta valor en columna obligatoria: sku'),
        ]
      );
    }
  });

  return {
    errors: [],
    parsed,
    rowErrorIndexes: new Set(rowErrorMap.keys()),
    rowErrorMap,
  };
};
