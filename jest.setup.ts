import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// ----------------------------------------------------------------------
// TextEncoder / TextDecoder — required by react-router v7 in jsdom
// ----------------------------------------------------------------------
Object.assign(globalThis, { TextEncoder, TextDecoder });

// ----------------------------------------------------------------------
// process.env stubs for VITE_* variables
// Real values come from Vite's define map at build time; in Jest we set them
// here so modules that read process.env.VITE_* don't get undefined.
// Individual tests can override via jest.resetModules() + process.env.X = '...'
// ----------------------------------------------------------------------
process.env.VITE_ENV = process.env.VITE_ENV ?? 'test';
process.env.VITE_BACKEND_GRAPHQL_URL =
  process.env.VITE_BACKEND_GRAPHQL_URL ?? 'http://localhost:4000/graphql';
process.env.VITE_TOKEN_EXPIRATION_TIME = process.env.VITE_TOKEN_EXPIRATION_TIME ?? '30';
process.env.VITE_SERVER_URL = process.env.VITE_SERVER_URL ?? '';
process.env.VITE_ASSETS_DIR = process.env.VITE_ASSETS_DIR ?? '';

// ----------------------------------------------------------------------
// Polyfill File.prototype.arrayBuffer for JSDOM test environment
// ----------------------------------------------------------------------
if (typeof File !== 'undefined' && !File.prototype.arrayBuffer) {
  File.prototype.arrayBuffer = function (): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(this);
    });
  };
}
