import { convertParams } from '../utils';
import type { IApiEndpoint, IApiParams, IStream, ITrackResolver } from '../../types';
import { getConnection } from '../db';

type IParams = {
    streamId: number;
    needResolver?: boolean;
};

const defaultParams: IApiParams = {
    needResolver: '0',
};

const getStreamById: IApiEndpoint<IStream | IStream & ITrackResolver> = async props => {
    const {} = convertParams<IParams>({ ...defaultParams, ...props });

    const sql = props.needResolver
        ? 'select `stream`.*, `trackResolver`.`type`, `trackResolver`.`source` from `stream` left join `trackResolver` on `trackResolver`.`resolverId` = `stream`.`trackResolverId` where `streamId` = ?'
        : 'select * from `stream` where `streamId` = ?';

    const connect = await getConnection();
    const [rows] = await connect.execute(sql, [props.streamId]);

    const [stream] = rows as IStream[];

    return stream;
};

export default getStreamById;
