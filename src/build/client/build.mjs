import webpackPackage from 'webpack';

import { config } from './webpack.config.mjs';

function webpack(config) {
    return new Promise((resolve, reject) => {
        webpackPackage.webpack(config).run(err => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

async function main() {
    const start = Date.now();

    await webpack(config);

    const end = Date.now();

    console.log('Client built in %dms', end - start);
}

main();
