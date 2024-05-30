import { context } from 'esbuild';
import { RestartOnRebuild } from '@veluga/esbuild-restart-on-rebuild';

import { config } from './esbuild.config.mjs';

export async function watchServer() {
    config.plugins.push(RestartOnRebuild({
        onRebuildStart: () => console.log('[server] Rebuild started'),
        onRebuildEnd: ms => console.log('[server] Rebuilt in %dms', ms),
    }));

    const ctx = await context(config);

    await ctx.watch();
}
