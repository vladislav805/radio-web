import type { Connection } from 'mysql2/promise';

import type { IApiParams, IStreamDatabase } from '@typings';

import { convertParams } from '../utils';
import { getConnection } from '../db';

interface IParams {
    streamId: number;
}

const defaultParams: IApiParams = {};

export async function getStreamById(props: IApiParams): Promise<IStreamDatabase | undefined> {
    const { streamId } = convertParams<IParams>({ ...defaultParams, ...props });

    const sql = 'select * from `stream` where `streamId` = ?';

    let connect: Connection | undefined = undefined;
    try {
        connect = await getConnection();
        const [rows] = await connect.execute(sql, [streamId]);

        const [stream] = rows as IStreamDatabase[];

        return stream;
    } catch (err) {
        throw new Error('Unknown error');
    } finally {
        connect?.destroy();
    }
}
