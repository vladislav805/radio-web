import express from 'express';
import getStations from './methods/getStations';
import getCurrentTrack from './methods/getCurrentTrack';
import getStreamById from './methods/getStreamById';
import type { IApiEndpoint, IApiParams, IError } from '../types';
import { SERVER_PORT } from '../shared';

const service = express();

const methods: Record<string, IApiEndpoint<any>> = {
    getStations,
    getCurrentTrack,
    getStreamById,
};

service.all('/api/:method', async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const methodName = req.params.method;

    if (methodName in methods) {
        const result = await methods[methodName](req.query as IApiParams);

        res.send({ result });
    } else {
        const error: IError = { errorCode: 4 };

        res.send({ error });
    }
});

service.listen(SERVER_PORT, () => console.log('Server started'));
