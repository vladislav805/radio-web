import axios from 'axios';

import type { IApiParams, ICurrentTrack, ITrackResolver, IStreamDatabase } from '@typings';

import { getStreamById } from './getStreamById';
import { convertParams, getValueByPath } from '../utils';

interface IParams {
    streamId: number;
}

type ITrackResolveJsonStrategy = ICurrentTrack;

interface ITrackResolveDynamicStrategy {
    source: string;
}

type ITrackResolveStrategy =
    | ITrackResolveDynamicStrategy
    | ITrackResolveJsonStrategy;

export async function getCurrentTrack(props: IApiParams): Promise<ICurrentTrack> {
    const { streamId } = convertParams<IParams>(props);

    const stream = await getStreamById({
        streamId: String(streamId),
        needResolver: '1',
    }) as IStreamDatabase & ITrackResolver;

    if (!stream.trackUrl) {
        throw new Error();
    }

    if (stream.type === 'json') {
        const strategy: ITrackResolveStrategy = JSON.parse(stream.source);
        const { data } = await axios.get(stream.trackUrl, {
            responseType: 'json',
        });

        const paths = strategy as ITrackResolveJsonStrategy;

        return {
            artist: getValueByPath(data, paths.artist),
            title: getValueByPath(data, paths.title),
            image: paths.image ? getValueByPath(data, paths.image) : null,
        };
    } else {
        const makeRequest = (url: string) => axios.get(url, {
            responseType: 'text',
        }).then(res => res.data);

        const source = stream.source;
        const fx = new Function('args', source);

        return fx({ stream, makeRequest });
    }
}
