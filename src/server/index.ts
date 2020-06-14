import getStations from './methods/getStations';
import restana from 'restana';
import getCurrentTrack from './methods/getCurrentTrack';

const service = restana();

service.all('/api/getStations', async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(await getStations(req.query));
});

service.all('/api/getCurrentTrack', async(req, res) => {
    res.send(await getCurrentTrack(req.query));
});

service.start(7469).then(() => console.log('Server started'));
