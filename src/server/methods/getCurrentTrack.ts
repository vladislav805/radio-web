import axios from 'axios';

import type { IApiEndpoint, ICurrentTrack, IStream, ITrackResolver } from '../../types';
import getStreamById from './getStreamById';
import { getValueByPath } from '../utils';

type IParams = {
    streamId: number;
};

type ITrackResolveJsonStrategy = ICurrentTrack;

type ITrackResolveDynamicStrategy = {
    source: string;
};

type ITrackResolveStrategy = ITrackResolveDynamicStrategy | ITrackResolveJsonStrategy;

const getCurrentTrack: IApiEndpoint<ICurrentTrack, IParams> = async props => {
    const stream = await getStreamById({
        streamId: String(props.streamId),
        needResolver: '1',
    }) as IStream & ITrackResolver;

    if (stream.type === 'json') {
        const strategy: ITrackResolveStrategy = JSON.parse(stream.source);
        const { data } = await axios.get(stream.trackUrl, {
            responseType: 'json',
        });

        const paths = strategy as ITrackResolveJsonStrategy;

        return {
            artist: getValueByPath(data, paths.artist),
            title: getValueByPath(data, paths.title),
            image: getValueByPath(data, paths.image),
        };
    } else {
        const makeRequest = (url: string) => axios.get(url, {
            responseType: 'text',
        }).then(res => res.data);
        const source = stream.source;
        const fx = new Function('args', source);
        return await fx({ stream, makeRequest });
    }
};

export default getCurrentTrack;
