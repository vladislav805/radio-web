import type { RowDataPacket } from 'mysql2/promise';
import { cache, cached } from '../caching';
import { getConnection } from '../db';
import type { IApiEndpoint, IStation, IStream } from '../../types';

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
        return cachedData;
    }

    const connect = await getConnection();
    const [stations] = await connect.execute('select * from `station`');

    let result: IStation[] = Array.from(stations as RowDataPacket[]) as IStation[];

    if (extended) {
        const stationIds = result.map(station => station.stationId);

        const sql = `select \`stream\`.*, \`city\`.\`title\` as \`cityTitle\` from \`stream\` left join \`city\` on \`city\`.\`cityId\` = \`stream\`.\`cityId\` where \`stationId\` in (${stationIds.join(',')})`;

        const [streams] = await connect.execute(sql);

        const stationStreams: Record<number, IStream[]> = {};
        (Array.from(streams as RowDataPacket[]) as IStream[]).forEach(stream => {
            if (!(stream.stationId in stationStreams)) {
                stationStreams[stream.stationId] = [];
            }

            if (onlySecure && !stream.secure) return;

            stream.secure = Boolean(stream.secure);

            stream.canResolveTrack = Boolean(stream.trackResolverId);

            stream.trackResolverId = undefined;
            stream.trackUrl = undefined;

            stationStreams[stream.stationId].push(stream);
        });

        result = result.map(station => {
            station.streams = stationStreams[station.stationId];
            return station;
        }).filter(station => station.streams?.length);
    }

    cache(cacheKey, result, 10);

    return result;
};

export default getStations;
