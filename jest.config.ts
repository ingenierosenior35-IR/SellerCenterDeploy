import nextJest from "next/jest.js";

import type {Config} from 'jest';

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}", // Incluye todos los archivos TypeScript en la carpeta src
    "!src/**/*.d.ts",    // Excluye archivos de definición de TypeScript
    "!src/**/index.ts",   // Excluye archivos index.ts
    "!src/**/types.ts",
    "!src/interfaces/**",
    "!src/_mock/**"
  ],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "\\\\node_modules\\\\"
  ],
  coverageProvider: "v8",
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  testMatch: [
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/src/_mock/",
    "<rootDir>/__tests__/"
  ],
};

export default createJestConfig(config);
