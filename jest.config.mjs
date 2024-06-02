import { pathsToModuleNameMapper } from 'ts-jest';

import tsconfig from './tsconfig.json' assert { type: 'json' };

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
                // Note: We shouldn't need to include `isolatedModules` here because it's a deprecated config option in TS 5,
                // but setting it to `true` fixes the `ESM syntax is not allowed in a CommonJS module when
                // 'verbatimModuleSyntax' is enabled` error that we're seeing when running our Jest tests.
                isolatedModules: true,
                useESM: true,
            },
        ],
    },
    testMatch: [
        '<rootDir>/**/*.test.ts',
    ],
};
