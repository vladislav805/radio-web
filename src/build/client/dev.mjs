import { resolve } from 'path';
import webpackPackage from 'webpack';

import { Paths } from '../paths.mjs';
import { config } from './webpack.config.mjs';

export function watchClient() {
    config.cache = {
        type: 'filesystem',
        cacheDirectory: resolve(Paths.root, 'node_modules', '.cache', 'webpack'),
    };

    config.plugins.push(new webpackPackage.ProgressPlugin());

    webpackPackage.webpack(config).watch({}, error => {
        if (error) {
            console.log('[client] Failed', error)
            return;
        }

        console.log('[client] Rebuilt done');
    });
}
