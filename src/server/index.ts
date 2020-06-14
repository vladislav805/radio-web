import getStations from './methods/getStations';
import restana from 'restana';
import getCurrentTrack from './methods/getCurrentTrack';

const service = restana();

//import bodyParser from 'body-parser';
//service.use(bodyParser.json());

service.get('/api/getStations', async(req, res) => {
    res.send(await getStations(req.query));
});

service.get('/api/getCurrentTrack', async(req, res) => {
    res.send(await getCurrentTrack(req.query));
});

service.start(7469).then(() => console.log('Server started'));
