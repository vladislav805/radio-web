const path = require('path');
const { defaults: tsjPreset } = require('ts-jest/presets');
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

/**
 * Конфигурация для запуска unit-тестов
 */

/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    rootDir: 'src',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: path.resolve(__dirname, 'src') }),
    testEnvironment: 'node',
    transform: {
        ...tsjPreset.transform,
    },
    testMatch: [
        '<rootDir>/**/*.test.ts',
    ],
};
