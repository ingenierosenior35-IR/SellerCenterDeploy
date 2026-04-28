import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/types.ts',
    '!src/interfaces/**',
    '!src/_mock/**',
    '!src/main.tsx',        // entry point, no logic
    '!src/routes/sections/**', // route tree, tested via integration
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  // Transform TS/TSX with SWC (matches Vite's compiler)
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },

  // Allow ESM packages (e.g. minimal-shared) to be transformed
  transformIgnorePatterns: ['/node_modules/(?!(minimal-shared)/)'],

  // Mock static assets
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.ts',
    '\\.(svg)(\\?react)?$': '<rootDir>/src/__mocks__/svgMock.tsx',
    // Stub import.meta.env for jest
    '^virtual:.*$': '<rootDir>/src/__mocks__/virtualMock.ts',
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/_mock/',
    '<rootDir>/__tests__/',
    '<rootDir>/src/app/',     // legacy Next.js app-dir tests
  ],
};

export default config;
