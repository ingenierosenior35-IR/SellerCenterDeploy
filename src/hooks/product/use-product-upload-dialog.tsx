import { useRef, useMemo, useState, useCallback } from 'react';

import { fileToBase64 } from 'src/utils/codificateFile';
// import { uploadProduct } from 'src/actions/upload/uploadProducts';
import { validateCsvFile } from 'src/utils/validate-csv';

import { useValidateMassUpload } from 'src/actions/product/useValidateMassUpload';

import { toast } from 'src/components/snackbar';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const CSV_ACCEPTED = ['text/csv', 'application/vnd.ms-excel', 'text/xml'];
const IMG_ACCEPTED = ['image/jpeg', 'image/png'];
const ZIP_ACCEPTED = ['application/zip', 'application/x-zip-compressed', 'multipart/x-zip'];
interface Result {
  ok: boolean;
  message: string;
}

export const useProductUploadDialog = ({ onClose }: { onClose: () => void }) => {
  const csvInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagesZip, setImagesZip] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const { mutateAsync } = useValidateMassUpload();

  const csvInvalid = useMemo(() => {
    if (!csvFile) return null;
    const badType = !CSV_ACCEPTED.includes(csvFile.type);
    const tooBig = csvFile.size > MAX_SIZE;
    return { badType, tooBig };
  }, [csvFile]);

  const imgsInvalid = useMemo(() => {
    const badType: string[] = [];
    const tooBig: string[] = [];
    images.forEach((f) => {
      if (!IMG_ACCEPTED.includes(f.type)) badType.push(f.name);
      if (f.size > MAX_SIZE) tooBig.push(f.name);
    });
    return { badType, tooBig };
  }, [images]);

  const zipInvalid = useMemo(() => {
    if (!imagesZip) return null;
    const badType =
      !ZIP_ACCEPTED.includes(imagesZip.type) && !imagesZip.name?.toLowerCase()?.endsWith('.zip');
    const tooBig = imagesZip.size > MAX_SIZE;
    return { badType, tooBig };
  }, [imagesZip]);

  const onPickCsv = () => csvInputRef.current?.click();
  const onPickImages = () => imgInputRef.current?.click();

  const handleCsvFiles = useCallback(async (fileList: FileList | null) => {
    const f = (fileList && fileList[0]) || null;
    if (!f) return;
    setCsvFile(f);
    setResult(null);

    setCsvErrors([]);
    const errors = await validateCsvFile(f);
    setCsvErrors(errors);
  }, []);

  const isZipFile = (f: File) =>
    ZIP_ACCEPTED.includes(f.type) ||
    (typeof f.name === 'string' && f.name.toLowerCase().endsWith('.zip'));

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

      const onlyImgs = arr.filter((f) => IMG_ACCEPTED.includes(f.type));
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

  const clearAll = () => {
    setCsvFile(null);
    setImages([]);
    setImagesZip(null);
    setResult(null);
  };

  const hasValidImagesChoice = useMemo(() => {
    if (imagesZip) return !(zipInvalid?.badType || zipInvalid?.tooBig);
    if (images.length > 0)
      return imgsInvalid.badType.length === 0 && imgsInvalid.tooBig.length === 0;
    return false;
  }, [imagesZip, zipInvalid, images, imgsInvalid]);

  const disabledUpload =
    uploading ||
    !csvFile ||
    (csvInvalid && (csvInvalid.badType || csvInvalid.tooBig)) ||
    (csvErrors && csvErrors.length > 0);

  const buildImagesZip = useCallback(async (files: File[]) => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        zip.file(file.name, arrayBuffer);
      })
    );
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'STORE',
    });
    return new File([blob], 'images.zip', { type: 'application/zip' });
  }, []);

  const handleUpload = useCallback(async () => {
    if (!csvFile) {
      setResult({ ok: false, message: 'Debes seleccionar un archivo antes de continuar.' });
      return;
    }
    const decodifiedContent = await fileToBase64(csvFile);

    setUploading(true);
    setResult(null);
    try {
      if (disabledUpload) {
        setResult({ ok: false, message: 'Revisa los archivos seleccionados.' });
        setUploading(false);
        return;
      }
      const request = {
        attributeSetId: 10,
        fileContentBase64: decodifiedContent,
        fileName: csvFile.name.split('.')[0],
        fileType: csvFile.type.includes('csv')
          ? 'csv'
          : csvFile.type.includes('xml')
            ? 'xml'
            : csvFile.type.includes('excel')
              ? 'xls'
              : 'unknown',
      };
      const resp = await mutateAsync(request);
      if (resp.validateMassUpload.success) {
        handleCancelUpload();
        toast.success(`Importación completada`);
        setCsvFile(null);
      } else if (resp.validateMassUpload.success === false) {
        toast.error(resp.validateMassUpload.message || 'No se pudo iniciar la importación');
        setResult({
          ok: false,
          message: resp.validateMassUpload.message || 'No se pudo completar la carga',
        });
      } else {
        toast.error(resp.validateMassUpload.message || 'Error al iniciar la importación');
        setResult({
          ok: false,
          message: resp.validateMassUpload.message || 'No se pudo completar la carga',
        });
      }
    } catch (err: { message?: string } | any) {
      console.error('[ProductUploadDialog] upload error', err);
      toast.error(err?.message || 'Error en la carga');
      setResult({
        ok: false,
        message: err?.message || 'No se pudo completar la carga',
      });
    } finally {
      setUploading(false);
    }
  }, [csvFile, disabledUpload]);

  const handleCancelUpload = () => {
    clearAll();
    setShowCancelDialog(false);
    onClose();
  };

  const handleCancelBulkUpload = () => {
    if (!!csvFile || images.length > 0 || !!imagesZip) {
      setShowCancelDialog(true);
    } else {
      handleCancelUpload();
    }
  };

  return {
    csvInputRef,
    imgInputRef,
    csvFile,
    images,
    imagesZip,
    uploading,
    result,
    showCancelDialog,
    csvInvalid,
    imgsInvalid,
    zipInvalid,
    disabledUpload,
    hasValidImagesChoice,
    csvErrors,
    onPickCsv,
    onPickImages,
    handleCsvFiles,
    handleImageFiles,
    onDropCsv,
    onDropImages,
    clearAll,
    handleUpload,
    handleCancelUpload,
    handleCancelBulkUpload,
    setCsvFile,
    setImages,
    setImagesZip,
    setShowCancelDialog,
  };
};
