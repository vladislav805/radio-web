import type { Connection, RowDataPacket } from 'mysql2/promise';

import type { IApiParams, IStation, IStream, IStreamDatabase } from '@typings';

import { cache, cached } from '../caching';
import { getConnection } from '../db';
import { convertParams } from '../utils';

interface IParams {
    extended?: boolean;
    onlySecure?: boolean;
    noReferrer?: boolean;
}

const defaultParams: IApiParams = {
    extended: '0',
    onlySecure: '0',
};

export async function getStations(rawParams: IApiParams): Promise<IStation[]> {
    const { extended, onlySecure, noReferrer } = convertParams<IParams>({ ...defaultParams, ...rawParams });

    const cacheKey = `list_${!!extended}_${!!onlySecure}_${noReferrer}`;

    const cachedData = cached<IStation[]>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    let connect: Connection | undefined = undefined;
    try {
        connect = await getConnection();

        const [stations] = await connect.execute('select * from `station`');

        let result: IStation[] = Array.from(stations as RowDataPacket[]) as IStation[];

        if (extended) {
            const stationIds = result.map(station => station.stationId);

            const sql = `select \`stream\`.*, \`city\`.\`title\` as \`cityTitle\` from \`stream\` left join \`city\` on \`city\`.\`cityId\` = \`stream\`.\`cityId\` where \`stationId\` in (${stationIds.join(',')})`;

            const [streams] = await connect.execute<RowDataPacket[]>(sql);

            const stationStreams: Record<number, IStream[]> = {};

            (Array.from(streams) as IStreamDatabase[]).forEach(stream => {
                if (!(stream.stationId in stationStreams)) {
                    stationStreams[stream.stationId] = [];
                }

                if (onlySecure && !stream.secure || noReferrer && stream.noReferrer) return;

                stationStreams[stream.stationId].push({
                    streamId: stream.streamId,
                    stationId: stream.stationId,
                    url: stream.url,
                    format: stream.format,
                    bitrate: stream.bitrate,
                    cityId: stream.cityId,
                    cityTitle: stream.cityTitle,
                    noReferrer: Boolean(stream.noReferrer),
                    secure: Boolean(stream.secure),
                    canResolveTrack: Boolean(stream.resolver),
                });
            });

            result = result.map(station => {
                station.streams = stationStreams[station.stationId];
                return station;
            }).filter(station => station.streams?.length);
        }

        cache(cacheKey, result, 10);

        return result;
    } catch (e) {
        throw new Error('Unknown error');
    } finally {
        connect?.destroy();
    }
}
