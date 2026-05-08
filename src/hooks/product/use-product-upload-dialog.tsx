import type {
  ImportMode,
  QueueMassUploadImportResponseInterface,
} from 'src/interfaces/load/bulk-loading.interface';

import { useRef, useMemo, useState, useCallback } from 'react';

import { fileToBase64 } from 'src/utils/codificateFile';
import { parseCsv, type ParsedCsv } from 'src/utils/parse-csv';
import { CSV_MAX_BYTES, validateCsvFile, validateCsvContent } from 'src/utils/validate-csv';

import { useTranslate } from 'src/locales';
import { useValidateMassUpload } from 'src/actions/product/useValidateMassUpload';
import { useQueueMassUploadImport } from 'src/actions/product/useQueueMassUploadImport';

import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const CSV_ACCEPTED = new Set([
  'text/csv',
  'application/vnd.ms-excel',
  'text/xml',
  'application/csv',
  'text/plain',
]);
const IMG_ACCEPTED = new Set(['image/jpeg', 'image/png']);
const ZIP_ACCEPTED = new Set(['application/zip', 'application/x-zip-compressed', 'multipart/x-zip']);
const MAX_IMG_BYTES = 5 * 1024 * 1024;

interface ResultBanner {
  ok: boolean;
  message: string;
}

/**
 * Wizard de carga masiva (4 pasos):
 *  0 - Upload CSV + ZIP de imágenes (opcional) + selección de modo + validación local
 *  1 - Preview tabulado con marcado de filas con error local
 *  2 - Procesando (validateMassUpload → queueMassUploadImport)
 *  3 - Encolado (job_id, status: pending, mensaje del backend)
 */
export type UploadStep = 0 | 1 | 2 | 3;

const isCsvByName = (name: string) => /\.csv$/i.test(name);
const isZipByName = (name: string) => /\.zip$/i.test(name);

/**
 * `fileToBase64` retorna un dataURL (`data:<mime>;base64,<payload>`). El
 * backend espera solo el payload — strip del prefijo si está presente.
 */
const stripDataUrlPrefix = (b64: string): string => {
  const idx = b64.indexOf(',');
  return idx >= 0 ? b64.slice(idx + 1) : b64;
};

export const useProductUploadDialog = ({ onClose }: { onClose: () => void }) => {
  const csvInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  // Step
  const [step, setStep] = useState<UploadStep>(0);

  // Files
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [imagesZip, setImagesZip] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]); // legacy back-compat

  // Mode
  const [importMode, setImportMode] = useState<ImportMode>('CREATE');

  // CSV parse + validation
  const [parsedCsv, setParsedCsv] = useState<ParsedCsv | null>(null);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [rowErrorMap, setRowErrorMap] = useState<Map<number, string[]>>(new Map());

  // Backend state
  const [uploading, setUploading] = useState(false);
  const [queueResult, setQueueResult] =
    useState<QueueMassUploadImportResponseInterface | null>(null);

  // UX
  const [result, setResult] = useState<ResultBanner | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { mutateAsync: validateMassUpload } = useValidateMassUpload();
  const { mutateAsync: queueMassUploadImport } = useQueueMassUploadImport();
  const { translate } = useTranslate();

  // -------------------- Validity flags --------------------

  const csvInvalid = useMemo(() => {
    if (!csvFile) return null;
    const badType = !CSV_ACCEPTED.has(csvFile.type) && !isCsvByName(csvFile.name);
    const tooBig = csvFile.size > CSV_MAX_BYTES;
    return { badType, tooBig };
  }, [csvFile]);

  const imgsInvalid = useMemo(() => {
    const badType: string[] = [];
    const tooBig: string[] = [];
    images.forEach((f) => {
      if (!IMG_ACCEPTED.has(f.type)) badType.push(f.name);
      if (f.size > MAX_IMG_BYTES) tooBig.push(f.name);
    });
    return { badType, tooBig };
  }, [images]);

  const zipInvalid = useMemo(() => {
    if (!imagesZip) return null;
    const badType =
      !ZIP_ACCEPTED.has(imagesZip.type) && !isZipByName(imagesZip.name);
    const tooBig = imagesZip.size > MAX_IMG_BYTES;
    return { badType, tooBig };
  }, [imagesZip]);

  // -------------------- File pickers --------------------

  const onPickCsv = () => csvInputRef.current?.click();
  const onPickImages = () => imgInputRef.current?.click();

  const handleCsvFiles = useCallback(
    async (fileList: FileList | null) => {
      const f = fileList?.[0] || null;
      if (!f) return;
      setCsvFile(f);
      setResult(null);
      setParsedCsv(null);
      setRowErrorMap(new Map());
      setQueueResult(null);

      const errors = await validateCsvFile(f, { translate });
      setCsvErrors(errors);
    },
    [translate]
  );

  const isZipFile = (f: File) => ZIP_ACCEPTED.has(f.type) || isZipByName(f.name ?? '');

  const handleImageFiles = useCallback(
    (fileList: FileList | null) => {
      const arr = Array.from(fileList || []);
      if (!arr.length) return;

      const zip = arr.find((f) => isZipFile(f));
      if (zip) {
        setImagesZip(zip);
        setImages([]);
        setResult(null);
        return;
      }

      const onlyImgs = arr.filter((f) => IMG_ACCEPTED.has(f.type));
      if (!onlyImgs.length) return;

      const map = new Map(images.map((x) => [x.name + x.size, x]));
      onlyImgs.forEach((f) => map.set(f.name + f.size, f));
      setImages(Array.from(map.values()));
      setImagesZip(null);
      setResult(null);
    },
    [images]
  );

  const onDropCsv = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.files?.length) handleCsvFiles(e.dataTransfer.files);
    },
    [handleCsvFiles]
  );

  const onDropImages = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.files?.length) handleImageFiles(e.dataTransfer.files);
    },
    [handleImageFiles]
  );

  // -------------------- Wizard transitions --------------------

  /**
   * Step 0 → 1: parsea el CSV en cliente, valida headers + filas según `mode`.
   * Si hay errores de archivo no avanza.
   */
  const goToPreview = useCallback(async () => {
    if (!csvFile) return;
    setResult(null);

    const text = await csvFile.text();
    const parsed = parseCsv(text);

    const fileErrors = await validateCsvFile(csvFile, { mode: importMode, parsed, translate });
    setCsvErrors(fileErrors);

    if (fileErrors.length > 0) {
      setParsedCsv(parsed);
      setRowErrorMap(new Map());
      return;
    }

    const validation = validateCsvContent(parsed, importMode, { translate });
    setParsedCsv(parsed);
    setRowErrorMap(validation.rowErrorMap);
    setStep(1);
  }, [csvFile, importMode, translate]);

  const goBackToUpload = useCallback(() => setStep(0), []);

  /**
   * Step 1 → 2 → 3:
   *  1) validateMassUpload(csv base64) → profile_id
   *  2) POST REST /rest/V1/import/products (multipart) con csv_file + images_zip_file
   *  3) Respuesta { job_id, status } → setQueueResult, step 3.
   */
  const confirmAndImport = useCallback(async () => {
    if (!csvFile) return;
    setStep(2);
    setUploading(true);
    setResult(null);
    setQueueResult(null);

    try {
      const csvBase64 = stripDataUrlPrefix(await fileToBase64(csvFile));
      let fileType = 'csv';
      if (csvFile.type.includes('xml')) {
        fileType = 'xml';
      } else if (csvFile.type.includes('excel')) {
        fileType = 'xls';
      }

      const validation = await validateMassUpload({
        attributeSetId: 10,
        fileContentBase64: csvBase64,
        fileName: csvFile.name.replace(/\.[^.]+$/, ''),
        fileType,
      });

      if (!validation.validateMassUpload.success || !validation.validateMassUpload.profile_id) {
        const message =
          validation.validateMassUpload.message || translate('productLoad', 'queue.validationFailed');
        toast.error(message);
        setResult({ ok: false, message });
        setStep(0);
        return;
      }

      const queue = await queueMassUploadImport({
        profileId: validation.validateMassUpload.profile_id,
        importMode,
        csvFile,
        imagesZipFile: imagesZip,
      });

      setQueueResult(queue);
      setStep(3);
    } catch (err: any) {
      const message = err?.message || translate('productLoad', 'queue.uploadError');
      toast.error(message);
      setResult({ ok: false, message });
      setStep(0);
    } finally {
      setUploading(false);
    }
  }, [csvFile, imagesZip, importMode, validateMassUpload, queueMassUploadImport, translate]);

  // -------------------- Reset / cancel --------------------

  const clearAll = useCallback(() => {
    setCsvFile(null);
    setImages([]);
    setImagesZip(null);
    setResult(null);
    setParsedCsv(null);
    setRowErrorMap(new Map());
    setCsvErrors([]);
    setQueueResult(null);
    setStep(0);
  }, []);

  const handleCancelUpload = useCallback(() => {
    clearAll();
    setShowCancelDialog(false);
    onClose();
  }, [clearAll, onClose]);

  const handleCancelBulkUpload = useCallback(() => {
    if (!!csvFile || images.length > 0 || !!imagesZip) {
      setShowCancelDialog(true);
    } else {
      handleCancelUpload();
    }
  }, [csvFile, images, imagesZip, handleCancelUpload]);

  const hasValidImagesChoice = useMemo(() => {
    if (imagesZip) return !(zipInvalid?.badType || zipInvalid?.tooBig);
    if (images.length > 0) return imgsInvalid.badType.length === 0 && imgsInvalid.tooBig.length === 0;
    return false;
  }, [imagesZip, zipInvalid, images, imgsInvalid]);

  // Step 0 main button
  const disabledNext =
    uploading ||
    !csvFile ||
    !!(csvInvalid && (csvInvalid.badType || csvInvalid.tooBig)) ||
    csvErrors.length > 0 ||
    !!(imagesZip && (zipInvalid?.badType || zipInvalid?.tooBig));

  const hasLocalRowErrors = rowErrorMap.size > 0;

  const handleUpload = useCallback(async () => {
    if (step === 0) await goToPreview();
    else if (step === 1) await confirmAndImport();
  }, [step, goToPreview, confirmAndImport]);

  return {
    // refs + files
    csvInputRef,
    imgInputRef,
    csvFile,
    images,
    imagesZip,
    setCsvFile,
    setImages,
    setImagesZip,

    // wizard
    step,
    setStep,
    importMode,
    setImportMode,
    parsedCsv,
    rowErrorMap,
    hasLocalRowErrors,
    queueResult,

    // backend status
    uploading,
    result,

    // validity
    csvInvalid,
    imgsInvalid,
    zipInvalid,
    csvErrors,
    hasValidImagesChoice,
    disabledUpload: disabledNext,

    // pickers
    onPickCsv,
    onPickImages,
    handleCsvFiles,
    handleImageFiles,
    onDropCsv,
    onDropImages,

    // wizard actions
    goToPreview,
    goBackToUpload,
    confirmAndImport,
    clearAll,

    // back-compat
    handleUpload,
    handleCancelUpload,
    handleCancelBulkUpload,
    showCancelDialog,
    setShowCancelDialog,
  };
};
