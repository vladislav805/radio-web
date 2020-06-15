import getStations from './methods/getStations';
import restana from 'restana';
import getCurrentTrack from './methods/getCurrentTrack';
import { IApiEndpoint, IError } from '../types';
import getStreamById from './methods/getStreamById';

const service = restana();

const methods: Record<string, IApiEndpoint<any>> = {
    getStations,
    getCurrentTrack,
    getStreamById,
};

service.all('/api/:method', async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const methodName = req.params.method;

    if (methodName in methods) {
        const result = await methods[methodName](req.query);

        res.send({ result });
    } else {
        const error: IError = { errorCode: 4 };

        res.send({ error });
    }
});

service.start(7469).then(() => console.log('Server started'));
