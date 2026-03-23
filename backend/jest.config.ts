import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.test.ts'],
  transform: { '^.+\\.ts$': 'ts-jest' },
  clearMocks: true,
  collectCoverage: false,
  setupFiles: ['<rootDir>/__tests__/setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};

export default config;
