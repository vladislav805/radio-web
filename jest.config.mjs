import { pathsToModuleNameMapper } from 'ts-jest';

import tsconfig from './tsconfig.json' with { type: 'json' };

import { Paths } from './src/build/paths.mjs';

/**
 * Конфигурация для запуска unit-тестов
 */

/** @type {import('jest').Config} */
export default {
    preset: 'ts-jest',
    rootDir: 'src',
    moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: Paths.src }),
    testEnvironment: 'node',
    transform: {
        '.ts': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    testMatch: [
        '<rootDir>/**/*.test.ts',
    ],
    coverageReporters: ['text'],
};
