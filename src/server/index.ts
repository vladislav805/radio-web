import { resolve } from 'node:path';
import express from 'express';
import type { IApiParams, IError } from '@typings';

import { getStations } from './apiMethods/getStations';
import { getCurrentTrack } from './apiMethods/getCurrentTrack';
import { getStreamById } from './apiMethods/getStreamById';
import { checkAll } from './apiMethods/checkAll';

const SERVER_PORT = Number(process.env.PORT ?? 7469);

export const service = express();

const methods: Record<string, (params: IApiParams) => unknown> = {
    getStations,
    getCurrentTrack,
    getStreamById,
    checkAll,
};

service.all('/api/:method', async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const methodName = req.params.method;
    let response: any;

    if (methodName in methods) {
        try {
            response = {
                result: await methods[methodName](req.query as IApiParams)
            };
        } catch (e) {
            response = {
                error: e && e instanceof Error ? e.message : 'Unknown error',
            };
        }
    } else {
        const error: IError = { errorCode: 4 };

        response = { error };
    }

    res.send(response);
});

service.use((req, res, next) => {
    const hasHiddenPathSegment = req.path
        .split('/')
        .some(pathSegment => pathSegment.startsWith('.'));

    if (hasHiddenPathSegment) {
        res.sendStatus(404);
        return;
    }

    next();
});

service.use(express.static(__dirname, {
    dotfiles: 'ignore',
}));

service.get(/.*/, (_req, res) => {
    res.sendFile(resolve(__dirname, 'index.html'));
});

service.listen(SERVER_PORT, () => console.log(`Server started: http://localhost:${SERVER_PORT}/`));
