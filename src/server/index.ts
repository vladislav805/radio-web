import express from 'express';
import type { IApiParams, IError } from '@typings';

import { getStations } from './apiMethods/getStations';
import { getCurrentTrack } from './apiMethods/getCurrentTrack';
import { getStreamById } from './apiMethods/getStreamById';

import { SERVER_PORT } from '../shared';

export const service = express();

const methods: Record<string, (params: IApiParams) => unknown> = {
    getStations,
    getCurrentTrack,
    getStreamById,
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

service.listen(SERVER_PORT, () => console.log(`Server started: http://localhost:${SERVER_PORT}/`));
