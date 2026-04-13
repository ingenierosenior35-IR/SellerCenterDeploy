
export function validateCsvFile(file: File): Promise<string[]> {
  return new Promise<string[]>((resolve) => {
    // permited by encoding limitation, graph input only accpet a limit number of caracters
    if(file.size > 784873) {
      resolve(['El archivo CSV es demasiado grande. El tamaño máximo permitido es de 1 MB.']);
      return;
    }
    resolve([]);
  });
}

