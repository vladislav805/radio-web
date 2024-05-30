import { resolve } from 'path';
import { Paths } from '../paths.mjs';

/** @type {import('esbuild').BuildOptions} */
export const config = {
    entryPoints: {
        index: resolve(Paths.src, 'server', 'index.ts'),
    },
    outfile: resolve(Paths.dist, '.index.server.js'),
    bundle: true,
    target: 'node20',
    platform: 'node',
    logLevel: 'warning',
    keepNames: true,
    plugins: [],
};
