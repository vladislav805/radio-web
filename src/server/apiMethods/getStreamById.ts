import type { Connection } from 'mysql2/promise';

import type { IApiParams, IStream, ITrackResolver } from '@typings';

import { convertParams } from '../utils';
import { getConnection } from '../db';

interface IParams {
    streamId: number;
    needResolver?: boolean;
};

const defaultParams: IApiParams = {
    needResolver: '0',
};

export async function getStreamById(props: IApiParams): Promise<IStream | (IStream & ITrackResolver)> {
    const { streamId, needResolver } = convertParams<IParams>({ ...defaultParams, ...props });

    const sql = needResolver
        ? 'select `stream`.*, `trackResolver`.`type`, `trackResolver`.`source` from `stream` left join `trackResolver` on `trackResolver`.`resolverId` = `stream`.`trackResolverId` where `streamId` = ?'
        : 'select * from `stream` where `streamId` = ?';

    let connect: Connection | undefined = undefined;
    try {
        connect = await getConnection();
        const [rows] = await connect.execute(sql, [streamId]);

        const [stream] = rows as IStream[];

        return stream;
    } catch (err) {
        throw new Error('Unknown error');
    } finally {
        connect?.destroy();
    }
}
