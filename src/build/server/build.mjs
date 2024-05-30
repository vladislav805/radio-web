import { build } from 'esbuild';

import { config } from './esbuild.config.mjs';

async function main() {
    const start = Date.now();

    await build(config);

    const end = Date.now();

    console.log('Server built in %dms', end - start);
}

main();
