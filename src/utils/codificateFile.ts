const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
};

const fileToBase64 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  return arrayBufferToBase64(buffer);
};

export { fileToBase64 };