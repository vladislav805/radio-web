import { IApiEndpoint, ICurrentTrack, IStream, ITrackResolver } from '../../types';
import getStreamById from './getStreamById';
import axios from 'axios';
import { getValueByPath } from '../utils';

type IParams = {
    streamId: number;
};

type ITrackResolveJsonStrategy = ICurrentTrack;

type TrackResolverDynamicFunction = (url: string) => ICurrentTrack;
type ITrackResolveDynamicStrategy = string | TrackResolverDynamicFunction;

type ITrackResolveStrategy = ITrackResolveDynamicStrategy | ITrackResolveJsonStrategy;

const getCurrentTrack: IApiEndpoint<ICurrentTrack, IParams> = async props => {
    const stream = await getStreamById({
        streamId: String(props.streamId),
        needResolver: '1',
    }) as IStream & ITrackResolver;

    const strategy: ITrackResolveStrategy = JSON.parse(stream.source);

    if (stream.type === 'json') {
        const { data } = await axios.get(stream.trackUrl, {
            responseType: 'json',
        });

        const paths = strategy as ITrackResolveJsonStrategy;

        return {
            artist: getValueByPath(data, paths.artist),
            title: getValueByPath(data, paths.title),
            image: getValueByPath(data, paths.image),
        };
    }

    return null;
};

export default getCurrentTrack;
