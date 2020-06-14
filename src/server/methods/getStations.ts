import { cache, cached } from '../caching';
import { getConnection } from '../db';
import { IApiEndpoint, IStation, IStream } from '../../types';
import { RowDataPacket } from 'mysql2/promise';

type IParams = {
    extended?: boolean;
    onlySecure?: boolean;
};

const defaultParams: IParams = {
    extended: false,
    onlySecure: false,
};

const getStations: IApiEndpoint<IStation[], IParams> = async rawParams => {
    const { extended, onlySecure } = { ...defaultParams, ...rawParams };

    const cacheKey = `list_${!!extended}_${!!onlySecure}`;

    const cachedData = cached<IStation[]>(cacheKey);
    if (cachedData) {
        return { result: cachedData };
    }

    const connect = await getConnection();
    const [stations] = await connect.execute('select * from `station`');


    let result: IStation[] = Array.from(stations as RowDataPacket[]) as IStation[];

    if (extended) {
        const stationIds = result.map(station => station.stationId);

        const sql = `select \`stream\`.*, \`city\`.\`title\` as \`cityTitle\` from \`stream\` left join \`city\` on \`city\`.\`cityId\` = \`stream\`.\`cityId\` where \`stationId\` in (${stationIds.join(',')})`;

        const [streams] = await connect.execute(sql);

        const stationStreams = {};
        (Array.from(streams as RowDataPacket[]) as IStream[]).forEach(stream => {
            if (!(stream.stationId in stationStreams)) {
                stationStreams[stream.stationId] = [];
            }

            if (onlySecure && !stream.secure) {
                return;
            }

            stream.secure = Boolean(stream.secure);

            stationStreams[stream.stationId].push(stream);
        });

        result = result.map(station => {
            station.streams = stationStreams[station.stationId];
            return station;
        }).filter(station => station.streams.length);
    }

    cache(cacheKey, result, 10);

    return { result };
};

export default getStations;
