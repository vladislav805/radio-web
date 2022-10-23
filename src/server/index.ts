import express from 'express';
import getStations from './methods/getStations';
import getCurrentTrack from './methods/getCurrentTrack';
import getStreamById from './methods/getStreamById';
import type { IApiEndpoint, IError } from '../types';
import { SERVER_PORT } from '../shared';
import { pageLegacy } from './legacy';

const service = express();

const methods: Record<string, IApiEndpoint<any>> = {
    getStations,
    getCurrentTrack,
    getStreamById,
};

service.get('/legacy', async(req, res) => {
    let html: string;
    try {
        html = await pageLegacy();
    } catch (e) {
        console.log(e);
        html = 'Error';
    }

    res.send(html);
});

service.all('/api/:method', async(req: express.Request, res: express.Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const methodName = req.params.method;

    if (methodName in methods) {
        const result = await methods[methodName](req.query as Record<string, string>);

        res.send({ result });
    } else {
        const error: IError = { errorCode: 4 };

        res.send({ error });
    }
});

service.listen(SERVER_PORT, () => console.log('Server started'));
