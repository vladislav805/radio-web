import { resolve } from 'path';

import { context } from 'esbuild';
import { RestartOnRebuild } from '@veluga/esbuild-restart-on-rebuild';

import { Paths } from '../paths.mjs';
import { config } from './esbuild.config.mjs';

export async function watchServer() {
    config.plugins.push(RestartOnRebuild({
        onRebuildStart: () => console.log('[server] Rebuild started'),
        onRebuildEnd: ms => console.log('[server] Rebuilt in %dms', ms),
    }));

    config.entryPoints = [resolve(Paths.src, 'server', 'dev.ts')];

    const ctx = await context(config);

    await ctx.watch();
}
